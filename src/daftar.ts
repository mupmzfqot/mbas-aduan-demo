import { createIcons, icons } from 'lucide'

function showStep(step: number) {
  document.getElementById('step-1')!.classList.add('hidden')
  document.getElementById('step-2')!.classList.add('hidden')
  document.getElementById('step-3')!.classList.add('hidden')
  document.getElementById('step-success')!.classList.add('hidden')
  document.getElementById('step-' + step)!.classList.remove('hidden')

  for (let i = 1; i <= 3; i++) {
    const indicator = document.getElementById('step-indicator-' + i)!
    const circle = indicator.querySelector('span:first-child') as HTMLElement
    const label = indicator.querySelector('span:last-child') as HTMLElement
    if (i <= step) {
      circle.className =
        'flex h-7 w-7 items-center justify-center rounded-full bg-mbas-cyan text-xs font-bold text-white'
      label.className = 'text-xs font-medium text-mbas-cyan'
    } else {
      circle.className =
        'flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500 dark:bg-gray-600 dark:text-gray-400'
      label.className = 'text-xs text-mbas-text-secondary'
    }
  }

  createIcons({ icons })
}

function showSuccess() {
  document.getElementById('step-1')!.classList.add('hidden')
  document.getElementById('step-2')!.classList.add('hidden')
  document.getElementById('step-3')!.classList.add('hidden')
  document.getElementById('step-success')!.classList.remove('hidden')
  createIcons({ icons })
}

// Expose to onclick handlers in HTML
declare global {
  interface Window {
    showStep: (step: number) => void
    showSuccess: () => void
  }
}
window.showStep = showStep
window.showSuccess = showSuccess
