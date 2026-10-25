import { ExternalLink, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#111317] py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Warning Banner in Footer */}
        <div className="bg-card/70 border border-border rounded-xl p-4 flex items-start space-x-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-mutedText leading-relaxed">
            <strong className="text-mainText font-semibold">Important Security Notice: </strong>
            Messages are permanently recorded on a public blockchain. Anyone may be able to
            read them. Never send passwords, private keys, financial secrets, or sensitive
            personal information.
          </p>
        </div>

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mutedText pt-4 border-t border-border/40">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-mainText">KeyDrop</span>
            <span>—</span>
            <span>Decentralized Messaging dApp on Botchain Testnet (Chain ID 968)</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <span>Botchain Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <span>RPC Endpoint</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
