import React from "react";

const Features: React.FC = () => {
  return (
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Funkce</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Anti-Raid</h3>
                <p className="text-lg text-gray-300 flex-grow">
                  Chraňte svůj server před škodlivými útoky a spamovými útoky pomocí pokročilých automatizovaných obran.
                  Náš systém
                  rychle identifikuje a neutralizuje potenciální hrozby, čímž zajišťuje bezpečné a zabezpečené prostředí
                  pro vaši
                  komunitu. Přizpůsobte nastavení podle svých konkrétních potřeb a užijte si klid s vědomím, že váš
                  server je chráněn
                  24/7 před nechtěnými průniky a narušujícími chováními.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Blacklist</h3>
                <p className="text-lg text-gray-300 flex-grow">
                  Blacklist je komplexní databáze nežádoucích uživatelů a známých podvodníků, spravovaná týmem
                  FurRaidDB.
                  Kromě tohoto globálního seznamu existuje také místní blacklistová funkce, která umožňuje běžným
                  uživatelům
                  spravovat vlastní seznam omezených uživatelů. Tento dvojí přístup zajišťuje, že váš server je chráněn
                  jak před
                  rozšířenými hrozbami, tak před konkrétními jednotlivci, kteří nejsou v souladu s vašimi komunitními
                  zásadami.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Moderation</h3>
                <p className="text-lg text-gray-300 flex-grow">
                  Udržujte pořádek a efektivně prosazujte pravidla pomocí výkonných nástrojů pro moderování. Umožněte
                  svým moderátorům
                  rychle řešit problémy, spravovat chování uživatelů a zajišťovat dodržování komunitních standardů. Naše
                  komplexní
                  sada moderovacích funkcí zahrnuje nástroje pro ztlumení, vykopnutí, zákaz a varování uživatelů. Zvýšte
                  funkčnost
                  svého serveru pomocí automatizovaných moderovacích možností, což zajišťuje konzistentní a spravedlivé
                  prosazování
                  vašich pravidel bez přetěžování vašeho týmu.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-white">Anti-Scammer</h3>
                <p className="text-lg text-white flex-grow">
                  Chraňte svou komunitu před podvodníky pomocí našich pokročilých nástrojů proti podvodníkům. Náš systém
                  monitoruje a
                  detekuje podezřelé aktivity, poskytuje vám upozornění v reálném čase a opatření k zabránění podvodům.
                  Buďte informováni
                  a přijímejte preventivní opatření, abyste zajistili bezpečnost a důvěryhodnost svého serveru, a
                  chránili své členy
                  před potenciálními podvody a klamáním.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Spam Filter</h3>
                <p className="text-lg text-gray-300 flex-grow">
                  Udržujte svůj server čistý a přehledný pomocí našeho pokročilého filtru spamu. Automaticky detekuje a
                  odstraňuje
                  spamové zprávy, čímž zajišťuje, že smysluplné konverzace nejsou přerušovány. Přizpůsobte citlivost
                  filtru a parametry
                  tak, aby co nejlépe vyhovovaly potřebám vaší komunity, a užijte si plynulejší a příjemnější
                  uživatelské prostředí bez
                  nechtěného spamu.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Invite Tracker</h3>
                <p className="text-lg text-gray-300 flex-grow">
                  Monitorujte a analyzujte aktivitu pozvánek pomocí našeho výkonného nástroje Invite Tracker. Sledujte,
                  kdo pozývá
                  nové členy na váš server a jak efektivní každá pozvánka je. Získejte přehled o růstu vaší komunity,
                  odměňujte nejlepší
                  pozývatele a identifikujte potenciální problémy související s pozvánkami. Invite Tracker vám pomáhá
                  porozumět a
                  spravovat příliv nových členů, čímž zajišťuje stabilní a zdravý růst vaší komunity.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Formulář pro ověření členů</h3>
                <p className="text-lg text-gray-300 flex-grow">
                  Zajistěte bezpečnost a důvěryhodnost vaší komunity pomocí našeho systému ověřování členů. Uživatelé
                  musí vyplnit několik
                  otázek ve formuláři a poté jej odeslat personálu ke kontrole. Tento proces pomáhá ověřit identitu
                  uživatelů a zajišťuje,
                  že do vaší komunity se připojují pouze skuteční a důvěryhodní členové. Zlepšete kvalitu vaší komunity
                  a minimalizujte riziko
                  nežádoucích účtů pomocí efektivního ověřovacího procesu.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

            <div className="relative overflow-hidden">
              <div
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer min-h-full flex flex-col">
                <h3 className="text-xl font-bold mb-2">Systém podpory tiketů</h3>
                <p className="text-lg text-gray-300 flex-grow">
                  Usnadněte řešení problémů a dotazů ve vaší komunitě pomocí našeho pokročilého systému podpory tiketů.
                  Systém umožňuje členům jednoduše vytvářet tikety pro své problémy nebo otázky, které pak mohou být
                  přiřazeny správným moderátorům nebo členům podpory. Zajistěte rychlé a efektivní řešení problémů a
                  zlepšete
                  spokojenost členů vaší komunity díky transparentnímu a organizovanému procesu podpory.
                </p>
              </div>
              <div
                  className="absolute inset-0 rounded-lg border border-transparent hover:border-green-400 transition duration-300 cursor-pointer"></div>
            </div>

          </div>
        </div>
      </section>
  );
};

export default Features;
