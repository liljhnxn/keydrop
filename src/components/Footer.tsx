import { ExternalLink, ShieldAlert, Cpu, Globe, Link2 } from "lucide-react";
import { KEYDROP_ADDRESS } from "@/lib/contracts";

export function Footer() {
  const shortenAddr = (addr: string) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <footer className="border-t border-border bg-[#111317] py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Important Security Notice Banner */}
        <div className="bg-card/70 border border-border rounded-xl p-4 flex items-start space-x-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-mutedText leading-relaxed">
            <strong className="text-mainText font-semibold">Important Security Notice: </strong>
            Messages are permanently recorded on the public blockchain. All communications are
            publicly readable. Never send passwords, private keys, financial credentials, or sensitive
            personal information.
          </p>
        </div>

        {/* BOT Chain Ecosystem Showcase Section */}
        <div className="bg-[#15171C] border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* BOT Chain Identity & Official Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-[#0e1014] border border-emerald-500/30 p-1.5 shadow-lg shadow-emerald-500/10 shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-mainText tracking-tight">
                    BOT Chain Ecosystem
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                    Mainnet (Chain ID 677)
                  </span>
                </div>
                <p className="text-xs text-mutedText mt-0.5">
                  High-performance, decentralized EVM blockchain powered by BOT native token.
                </p>
              </div>
            </div>

            {/* Required Links: BOT Chain Website & BOT Chain Explorer with Logo at front */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2.5 px-4 py-2.5 bg-card hover:bg-cardHover border border-border hover:border-emerald-500/50 rounded-xl text-xs font-semibold text-mainText transition-all duration-200 shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 object-contain rounded shrink-0"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 text-mutedText" />
              </a>

              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2.5 px-4 py-2.5 bg-card hover:bg-cardHover border border-border hover:border-emerald-500/50 rounded-xl text-xs font-semibold text-mainText transition-all duration-200 shadow-sm"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 object-contain rounded shrink-0"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 text-mutedText" />
              </a>

              {KEYDROP_ADDRESS && (
                <a
                  href={`https://scan.botchain.ai/address/${KEYDROP_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  title={`Contract: ${KEYDROP_ADDRESS}`}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-xs font-semibold text-emerald-400 transition-all duration-200 shadow-sm font-mono"
                >
                  <img
                    src="/botchain-logo.png"
                    alt="BOT Chain"
                    className="w-4 h-4 object-contain rounded shrink-0"
                  />
                  <span>Contract: {shortenAddr(KEYDROP_ADDRESS)}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400/80" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Footer Meta & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mutedText pt-4 border-t border-border/40">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-mainText">KeyDrop</span>
            <span>—</span>
            <span>Decentralized Messaging dApp on BOT Chain (Chain ID 677)</span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 hover:text-primary transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-3.5 h-3.5 object-contain rounded shrink-0"
              />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 hover:text-primary transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-3.5 h-3.5 object-contain rounded shrink-0"
              />
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
