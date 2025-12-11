<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use App\Models\ContactPurchase;
use App\Mail\UserAccountSuspendedMail;
use App\Mail\UserVerificationRevokedMail;
use App\Mail\UserAccountDeletedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UsersController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('prenom', 'like', "%{$search}%")
                  ->orWhere('nom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by user type
        if ($request->filled('type')) {
            $query->where('type_utilisateur', $request->type);
        }

        // Filter by verification status
        if ($request->filled('verified')) {
            if ($request->verified === 'verified') {
                $query->where('est_verifie', true);
            } elseif ($request->verified === 'unverified') {
                $query->where('est_verifie', false);
            }
        }

        // Filter by email verification
        if ($request->filled('email_verified')) {
            if ($request->email_verified === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($request->email_verified === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        $users = $query->withCount(['properties', 'contactPurchases'])
                      ->orderBy('created_at', 'desc')
                      ->paginate(20)
                      ->withQueryString();

        // Get statistics
        $stats = [
            'total_users' => User::count(),
            'verified_users' => User::where('est_verifie', true)->count(),
            'agents' => User::where('type_utilisateur', 'AGENT')->count(),
            'owners' => User::where('type_utilisateur', 'PROPRIETAIRE')->count(),
            'pending_verifications' => User::where('type_utilisateur', 'AGENT')
                                          ->where('est_verifie', false)
                                          ->count(),
        ];

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->only(['search', 'type', 'verified', 'email_verified'])
        ]);
    }

    public function show($id)
    {
        $user = User::with(['properties.images', 'contactPurchases.property'])
                    ->findOrFail($id);

        $userStats = [
            'properties_count' => $user->properties()->count(),
            'published_properties' => $user->properties()->where('statut', 'PUBLIE')->count(),
            'pending_properties' => $user->properties()->where('statut', 'EN_ATTENTE')->count(),
            'total_spent' => $user->contactPurchases()->sum('montant_paye'),
            'contacts_purchased' => $user->contactPurchases()->count(),
        ];

        return Inertia::render('Admin/UserDetails', [
            'user' => $user,
            'stats' => $userStats
        ]);
    }

    public function updateVerification(Request $request, $id)
    {
        $request->validate([
            'verified' => 'required|boolean',
            'reason' => 'nullable|string|max:500'
        ]);

        $user = User::findOrFail($id);
        
        if ($user->type_utilisateur !== 'AGENT') {
            return redirect()->back()->with('error', 'Only agents can be verified');
        }

        $wasVerified = $user->est_verifie;
        
        $user->update([
            'est_verifie' => $request->verified
        ]);

        // Send verification email to agent when they get verified
        if (!$wasVerified && $request->verified && $user->type_utilisateur === 'AGENT') {
            try {
                \Mail::to($user)->send(new \App\Mail\AgentProfileVerified($user));
            } catch (\Exception $e) {
                \Log::error('Failed to send agent verification email: ' . $e->getMessage());
            }
        }
        
        // Send revocation email when verification is removed
        if ($wasVerified && !$request->verified) {
            try {
                $reason = $request->input('reason', 'Vérification révoquée par l\'administration');
                Mail::to($user)->send(new UserVerificationRevokedMail($user, $reason));
            } catch (\Exception $e) {
                \Log::error('Failed to send verification revocation email: ' . $e->getMessage());
            }
        }

        $message = $request->verified ? 'Agent verified successfully' : 'Agent verification revoked and notification sent';
        
        return redirect()->back()->with('success', $message);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:activate,suspend,delete',
            'reason' => 'nullable|string|max:500'
        ]);

        $user = User::findOrFail($id);

        switch ($request->action) {
            case 'suspend':
                // You would implement a suspended field in your users table
                $user->update(['is_suspended' => true]);
                
                // Send suspension email
                try {
                    $reason = $request->reason ?? 'Violation des conditions d\'utilisation';
                    Mail::to($user)->send(new UserAccountSuspendedMail($user, $reason));
                } catch (\Exception $e) {
                    \Log::error('Failed to send suspension email: ' . $e->getMessage());
                }
                
                $message = 'User suspended successfully and notification sent';
                break;
                
            case 'activate':
                $user->update(['is_suspended' => false]);
                
                // Send activation email
                try {
                    \Mail::to($user)->send(new \App\Mail\UserActivatedMail($user));
                } catch (\Exception $e) {
                    \Log::error('Failed to send activation email: ' . $e->getMessage());
                }
                
                $message = 'User activated successfully and notification sent';
                break;
                
            case 'delete':
                // Send deletion notification before deleting
                try {
                    $reason = $request->reason ?? 'Compte supprimé par l\'administration';
                    Mail::to($user)->send(new UserAccountDeletedMail($user, $reason));
                } catch (\Exception $e) {
                    \Log::error('Failed to send account deletion email: ' . $e->getMessage());
                }
                
                // Soft delete or hard delete based on your requirements
                $user->delete();
                $message = 'User deleted successfully and notification sent';
                return redirect()->route('admin.users')->with('success', $message);
        }

        return redirect()->back()->with('success', $message);
    }

    public function properties($id)
    {
        $user = User::findOrFail($id);
        
        $properties = $user->properties()
                          ->with(['images'])
                          ->orderBy('created_at', 'desc')
                          ->paginate(12);

        return response()->json($properties);
    }

    public function purchases($id)
    {
        $user = User::findOrFail($id);
        
        $purchases = $user->contactPurchases()
                         ->with(['property.images', 'property.proprietaire'])
                         ->orderBy('created_at', 'desc')
                         ->paginate(12);

        return response()->json($purchases);
    }
}
