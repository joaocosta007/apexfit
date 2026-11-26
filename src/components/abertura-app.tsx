import { SplashVisual } from "@/components/splash-visual";

/**
 * Decide, antes do primeiro paint, se a abertura aparece:
 * - só no app instalado (standalone), não em abas do navegador;
 * - uma vez por "sessão" do app: o sessionStorage é zerado quando o app é
 *   fechado totalmente, então ela volta a aparecer a cada nova abertura, mas
 *   não ao trocar de tela nem ao voltar do segundo plano.
 * Se o script falhar, a camada fica oculta (o padrão no CSS é display: none).
 */
const decidirAbertura = `(function () {
  try {
    var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    var chave = "apexfit-abertura-exibida";
    if (standalone && !sessionStorage.getItem(chave)) {
      sessionStorage.setItem(chave, "1");
      document.documentElement.setAttribute("data-abertura", "on");
    }
  } catch (e) {}
})();`;

/** Camada de abertura do app instalado; some sozinha via CSS (abertura-overlay). */
export function AberturaApp() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: decidirAbertura }} />
      <div className="abertura-overlay">
        <SplashVisual className="z-[200]" />
      </div>
    </>
  );
}
