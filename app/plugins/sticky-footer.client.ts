/**
 * On mobile, `.app-footer` is pinned with `position: fixed` (see index.scss)
 * so it stays glued to the screen bottom regardless of iOS Safari's
 * unreliable `vh`/`dvh` handling. Taking it out of flow means `.app-main`
 * needs matching bottom padding so its content isn't hidden underneath —
 * this mirrors the footer's real (possibly multi-line) height into a CSS
 * custom property, kept in sync as it changes.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const footer = document.querySelector('.app-footer')
    if (!footer) return

    const syncFooterHeight = () => {
      document.documentElement.style.setProperty('--footer-height', `${footer.getBoundingClientRect().height}px`)
    }

    syncFooterHeight()
    new ResizeObserver(syncFooterHeight).observe(footer)
  })
})
