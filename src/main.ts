import './styles/main.css'

// Dark mode toggle
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle')
  const html = document.documentElement

  if (localStorage.getItem('darkMode') === 'enabled') {
    html.classList.add('dark')
  }

  toggle?.addEventListener('click', () => {
    html.classList.toggle('dark')
    localStorage.setItem('darkMode', html.classList.contains('dark') ? 'enabled' : 'disabled')
  })
}

// Mobile sidebar toggle
function initSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle')
  const sidebar = document.getElementById('sidebar')
  const sidebarOverlay = document.getElementById('sidebar-overlay')

  function openSidebar() {
    sidebar?.classList.remove('-translate-x-full')
    sidebarOverlay?.classList.remove('hidden')
  }

  function closeSidebar() {
    sidebar?.classList.add('-translate-x-full')
    sidebarOverlay?.classList.add('hidden')
  }

  sidebarToggle?.addEventListener('click', openSidebar)
  sidebarOverlay?.addEventListener('click', closeSidebar)
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode()
  initSidebar()
})
