import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-600 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg
              fill="#FFF"
              width="24"
              height="24"
              viewBox="0 0 0.72 0.72"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.57.12H.51V.09a.03.03 0 0 0-.06 0v.03H.27V.09a.03.03 0 0 0-.06 0v.03H.15a.09.09 0 0 0-.09.09v.36a.09.09 0 0 0 .09.09h.42A.09.09 0 0 0 .66.57V.21A.09.09 0 0 0 .57.12M.6.57A.03.03 0 0 1 .57.6H.15A.03.03 0 0 1 .12.57V.36H.6ZM.6.3H.12V.21A.03.03 0 0 1 .15.18h.06v.03a.03.03 0 0 0 .06 0V.18h.18v.03a.03.03 0 0 0 .06 0V.18h.06A.03.03 0 0 1 .6.21Z" />
            </svg>
            <div>
              <div className="font-semibold">AgendaSus</div>
              <div className="text-xs text-slate-300">Juazeiro do Norte</div>
            </div>
          </div>

          <div className="text-sm text-slate-300">
            AgendaSus @ {new Date().getFullYear()}. Todos os Diretitos
            Reservados.
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm hover:text-slate-200 transition-colors"
            >
              Contato
            </Link>
            <Link
              href="#"
              className="text-sm hover:text-slate-200 transition-colors"
            >
              Email
            </Link>
            <Link
              href="#"
              className="text-sm hover:text-slate-200 transition-colors"
            >
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
