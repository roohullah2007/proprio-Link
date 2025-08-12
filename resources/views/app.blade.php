<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Proprio Link') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="https://proprio-link.fr/wp-content/uploads/2025/06/Group-1171275021.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="https://proprio-link.fr/wp-content/uploads/2025/06/Group-1171275021.svg">
        <link rel="icon" type="image/png" sizes="16x16" href="https://proprio-link.fr/wp-content/uploads/2025/06/Group-1171275021.svg">
        <link rel="apple-touch-icon" sizes="180x180" href="https://proprio-link.fr/wp-content/uploads/2025/06/Group-1171275021.svg">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#0F44FC">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
