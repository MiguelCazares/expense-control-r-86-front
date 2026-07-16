<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo area -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500 shadow-lg mb-4">
          <svg
            class="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">
          Route Control
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Bus Route Management System
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <slot />
      </div>
    </div>
  </div>
</template>
