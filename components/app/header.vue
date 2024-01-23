<template>
   <header class="py-2 grid divide-y gap-2 border-b isolate bg-white/50 backdrop-blur-md shadow">
      <div class="px-2 flex justify-between">
         <u-link
            to="/"
            class="p-2"
         >
            SIMBA School
         </u-link>
   
         <u-dropdown :items="dropdownItems">
            <u-button
               variant="ghost"
               color="gray"
               trailing-icon="i-heroicons-chevron-down-20-solid"
            >
               {{ user?.name }}
            </u-button>
   
            <template #logout="{ item }">
               <u-icon
                  :name="item.icon"
                  class="text-red-500"
               ></u-icon>
   
               <span class="truncate text-red-500">
                  {{ item.label }}
               </span>
            </template>
         </u-dropdown>
      </div>

      <div class="px-2 pt-2 flex items-center border-gray-200 gap-4">
         <u-button
            v-for="(item, index) in navbarItems"
            :key="index"
            variant="ghost"
         >
            {{ item.label }}
         </u-button>
      </div>
   </header>
</template>

<script setup lang="ts">
const store = useAppStore()
const authStore = useAuthStore()
const user = authStore.getUser

const dropdownItems = computed(() => [
   [
      {
         label: 'Profil',
         avatar: {
            src: user?.profile_picture || 'https://avatars.githubusercontent.com/u/739984?v=4'
         },
         click: () => {
            console.log(user)
         }
      }
   ],
   [
      {
         label: 'Log Out',
         slot: 'logout',
         icon: 'i-heroicons-left-on-rectangle',
         click: () => {
            console.log('logout')
         }
      }
   ]
])

const navbarItems = computed(() => [
   {
      label: 'Test',
      to: '#'
   },
   {
      label: 'Test 2',
      to: '#'
   },
   {
      label: 'Test 3',
      to: '#'
   },
   {
      label: 'Test 4',
      to: '#'
   },
])
</script>