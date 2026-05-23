import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "ApexFit <onboarding@resend.dev>";

export async function sendVerificationEmail(
  to: string,
  name: string,
  verifyUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Confirme seu e-mail — ApexFit",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;padding:40px;border:1px solid #e2e8f0;">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="background:#1E40AF;width:56px;height:56px;border-radius:12px;display:inline-block;line-height:56px;text-align:center;font-size:28px;">💪</div>
                    <h1 style="margin:16px 0 0;font-size:22px;color:#0f172a;">ApexFit</h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="font-size:16px;color:#334155;margin:0 0 8px;">Olá, <strong>${name}</strong>!</p>
                    <p style="font-size:15px;color:#64748b;margin:0 0 32px;">Clique no botão abaixo para confirmar seu e-mail e ativar sua conta.</p>
                    <a href="${verifyUrl}"
                       style="display:block;background:#1E40AF;color:#ffffff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-size:16px;font-weight:bold;">
                      Confirmar e-mail
                    </a>
                    <p style="font-size:13px;color:#94a3b8;margin:24px 0 0;text-align:center;">
                      Link válido por 24 horas. Se não foi você, ignore este e-mail.
                    </p>
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                    <p style="font-size:12px;color:#94a3b8;margin:0;text-align:center;">
                      Ou copie e cole no navegador:<br />
                      <span style="color:#1E40AF;word-break:break-all;">${verifyUrl}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Redefinir senha — ApexFit",
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;padding:40px;border:1px solid #e2e8f0;">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="background:#1E40AF;width:56px;height:56px;border-radius:12px;display:inline-block;line-height:56px;text-align:center;font-size:28px;">💪</div>
                    <h1 style="margin:16px 0 0;font-size:22px;color:#0f172a;">ApexFit</h1>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="font-size:16px;color:#334155;margin:0 0 8px;">Olá, <strong>${name}</strong>!</p>
                    <p style="font-size:15px;color:#64748b;margin:0 0 32px;">Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.</p>
                    <a href="${resetUrl}"
                       style="display:block;background:#1E40AF;color:#ffffff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-size:16px;font-weight:bold;">
                      Redefinir senha
                    </a>
                    <p style="font-size:13px;color:#94a3b8;margin:24px 0 0;text-align:center;">
                      Link válido por 1 hora. Se não foi você, ignore este e-mail — sua senha não será alterada.
                    </p>
                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
                    <p style="font-size:12px;color:#94a3b8;margin:0;text-align:center;">
                      Ou copie e cole no navegador:<br />
                      <span style="color:#1E40AF;word-break:break-all;">${resetUrl}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  });
}
