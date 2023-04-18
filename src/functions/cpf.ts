export function verifyCpf(login: string): boolean {
  login = login.replace(/[^\d]+/g, ""); // remove caracteres não numéricos

  if (login.length !== 11) return false; // deve ter exatamente 11 dígitos

  // verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  for (let i = 0; i < 10; i++) {
    if (login.substring(i, i + 1) !== login.substring(i + 1, i + 2)) {
      break;
    } else if (i === 9) {
      return false;
    }
  }

  // verifica os dígitos verificadores
  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(login.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(login.substring(9, 10))) {
    return false;
  }

  soma = 0;

  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(login.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(login.substring(10, 11))) {
    return false;
  }

  return true;
}

export function cleanCpf(login: string): string {
  return login.replace(/\D/g, ""); // remove todos os caracteres não numéricos (/\D/g) da string
}
