import { createIcons, icons } from 'lucide'

async function loadPartial(el: Element): Promise<void> {
  const name = el.getAttribute('data-include')
  if (!name) return

  const res = await fetch(`/partials/${name}.html`)
  const html = await res.text()
  el.outerHTML = html
}

function setActiveNav(active: string): void {
  const link = document.querySelector(`[data-nav="${active}"]`)
  if (link) {
    link.classList.remove('sidebar-link')
    link.classList.add('sidebar-link-active')
  }
}

function initDarkMode(): void {
  const html = document.documentElement
  if (localStorage.getItem('darkMode') === 'enabled') {
    html.classList.add('dark')
  }

  const toggle = document.getElementById('dark-mode-toggle')
  toggle?.addEventListener('click', () => {
    html.classList.toggle('dark')
    localStorage.setItem('darkMode', html.classList.contains('dark') ? 'enabled' : 'disabled')
  })
}

const SIDEBAR_WIDTH = '16rem'

function isDesktop(): boolean {
  return window.matchMedia('(min-width: 1024px)').matches
}

function setSidebarOpen(
  sidebar: HTMLElement,
  header: HTMLElement | null,
  content: HTMLElement | null,
  open: boolean
): void {
  if (open) {
    sidebar.style.transform = 'translateX(0)'
    if (header) header.style.left = SIDEBAR_WIDTH
    if (content) content.style.marginLeft = SIDEBAR_WIDTH
  } else {
    sidebar.style.transform = `translateX(-${SIDEBAR_WIDTH})`
    if (header) header.style.left = '0'
    if (content) content.style.marginLeft = '0'
  }
}

function initSidebar(): void {
  const sidebarToggle = document.getElementById('sidebar-toggle')
  const sidebar = document.getElementById('sidebar')
  const sidebarOverlay = document.getElementById('sidebar-overlay')
  const header = document.querySelector<HTMLElement>('.main-header')
  const content = document.querySelector<HTMLElement>('.main-content')

  if (!sidebar) return

  // Set initial state
  if (isDesktop()) {
    setSidebarOpen(sidebar, header, content, true)
  } else {
    setSidebarOpen(sidebar, header, content, false)
  }

  let desktopOpen = isDesktop()

  sidebarToggle?.addEventListener('click', () => {
    if (isDesktop()) {
      desktopOpen = !desktopOpen
      setSidebarOpen(sidebar, header, content, desktopOpen)
    } else {
      // Mobile: slide in with overlay
      setSidebarOpen(sidebar, header, content, true)
      sidebarOverlay?.classList.remove('hidden')
    }
  })

  sidebarOverlay?.addEventListener('click', () => {
    setSidebarOpen(sidebar, header, content, false)
    sidebarOverlay.classList.add('hidden')
  })

  // Re-sync on resize crossing lg breakpoint
  window.addEventListener('resize', () => {
    if (isDesktop()) {
      sidebarOverlay?.classList.add('hidden')
      setSidebarOpen(sidebar, header, content, desktopOpen)
    } else {
      setSidebarOpen(sidebar, header, content, false)
    }
  })
}

export async function initLayout(): Promise<void> {
  const includes = document.querySelectorAll('[data-include]')

  // Store header data before replacing elements
  let headerTitle = ''
  let headerBreadcrumb = ''
  let activePage = ''

  for (const el of includes) {
    if (el.getAttribute('data-include')?.startsWith('header')) {
      headerTitle = el.getAttribute('data-title') || ''
      headerBreadcrumb = el.getAttribute('data-breadcrumb') || ''
    }
    if (el.getAttribute('data-include')?.startsWith('sidebar')) {
      activePage = el.getAttribute('data-active') || ''
    }
  }

  // Load all partials
  for (const el of includes) {
    await loadPartial(el)
  }

  // Set header text
  const titleEl = document.getElementById('header-title')
  const breadcrumbEl = document.getElementById('header-breadcrumb')
  if (titleEl) titleEl.textContent = headerTitle
  if (breadcrumbEl) breadcrumbEl.textContent = headerBreadcrumb

  // Set active nav
  if (activePage) setActiveNav(activePage)

  // Initialize everything
  createIcons({ icons })
  initDarkMode()
  initSidebar()
}

// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const hasIncludes = document.querySelector('[data-include]')
  if (hasIncludes) {
    initLayout()
  } else {
    // Pages without layout (login, daftar) — just init icons + dark mode
    createIcons({ icons })
    initDarkMode()
    initSidebar()
  }
})
