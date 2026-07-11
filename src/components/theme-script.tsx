/** Inline FOUC guard: apply stored theme before paint. */
export function ThemeScript() {
  const code = `(function(){try{var k='tact-theme';var p=localStorage.getItem(k)||'system';var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var t=d?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
