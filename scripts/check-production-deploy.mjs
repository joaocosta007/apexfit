import { execFileSync } from "node:child_process";

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

const branch = git("branch", "--show-current");
const changes = git("status", "--porcelain");

if (branch !== "main") {
  throw new Error(`Deploy de produção bloqueado: branch atual é ${branch || "desconhecida"}, não main.`);
}

if (changes) {
  throw new Error("Deploy de produção bloqueado: existem alterações sem commit.");
}

execFileSync("git", ["fetch", "origin", "main"], { stdio: "inherit" });

const localCommit = git("rev-parse", "HEAD");
const remoteCommit = git("rev-parse", "origin/main");

if (localCommit !== remoteCommit) {
  throw new Error("Deploy de produção bloqueado: o commit local não é o mesmo de origin/main. Faça push antes do deploy.");
}

console.log(`Deploy validado no commit ${localCommit.slice(0, 12)}.`);
