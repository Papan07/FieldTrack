"use client";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-emerald-950 overflow-x-hidden font-sans">
      {/* Government AP Forest Department Header Banner */}
      <div className="bg-emerald-900 border-b border-emerald-800 px-6 lg:px-12 py-2.5 flex items-center justify-between text-xs text-emerald-100">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-wider uppercase text-emerald-300">Government of Andhra Pradesh</span>
          <span className="opacity-40">•</span>
          <span>Environment, Forests, Science & Technology Department</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] opacity-90">
          <span>Aranya Bhavan, Mangalagiri</span>
          <span>•</span>
          <span>Support: apforest-support@ap.gov.in</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="flex-none px-6 lg:px-12 py-4 bg-white/95 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 no-underline group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-green-600 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <div className="font-black text-2xl tracking-tight text-emerald-950 flex items-center gap-1.5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Field<span className="text-emerald-600">Track</span>
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">
                AP Forest Station Portal
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/checkin" className="text-emerald-800 hover:text-emerald-600 font-semibold text-sm transition-colors px-3 py-2">
              Officer Check-In
            </Link>
            <Link href="/admin" className="ui-button-primary text-sm font-bold py-2.5 px-5 no-underline flex items-center gap-2 shadow-lg shadow-emerald-600/20">
              Range HQ Portal &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Fullscreen Width Container */}
      <main className="flex-1 w-full px-6 lg:px-12 py-10 flex flex-col gap-16 bg-white">
        
        {/* Section 1: Hero Banner (Main Welcome) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Government of Andhra Pradesh | Environment, Forests, Science & Technology Department
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-950 tracking-tight leading-[1.12] mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Andhra Pradesh <br />
              <span className="text-emerald-600 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Forest Department
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-800/80 leading-relaxed mb-8">
              Welcome to the official portal of the Andhra Pradesh Forest Department. We are dedicated to the sustainable management, protection, and conservation of the rich biological diversity across the Eastern Ghats and coastal ecosystems. Through scientific forestry, community partnership, and modern geomatics, we strive to maintain ecological balance, protect wildlife habitats, and enhance the green cover of the state for future generations.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/checkin" className="ui-button-primary text-base py-4 px-8 flex items-center justify-center gap-3 no-underline shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Officer Station Check-In
              </Link>
              <Link href="/admin" className="ui-button-secondary text-base py-4 px-8 border-emerald-200 text-emerald-900 flex items-center justify-center gap-2 no-underline hover:bg-emerald-50">
                Launch HQ Monitoring Map
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-emerald-100 shadow-2xl group">
              <div className="relative h-[420px] w-full">
                <Image
                  src="/ap-forest-hero.png"
                  alt="Andhra Pradesh Forest Department Station"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-100 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl flex-none shadow-md">
                    🏛️
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      State Forest Conservation Headquarters
                    </h4>
                    <p className="text-emerald-700 text-xs">
                      Eastern Ghats Conservation Division • Aranya Bhavan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Leadership Desk Copy */}
        <div className="w-full bg-emerald-50/60 p-8 rounded-3xl border border-emerald-100 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mb-8 text-center" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Leadership Desk & Strategic Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Minister Column */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold flex-none">
                    🏛️
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-emerald-950">Sri Konidala Pawan Kalyan</h3>
                    <p className="text-emerald-600 text-xs font-bold">Hon'ble Minister for Environment, Forests, Science & Technology</p>
                  </div>
                </div>
                <blockquote className="text-emerald-900/80 text-sm italic leading-relaxed border-l-3 border-emerald-500 pl-4 py-1">
                  "Our mission is to build a climate-resilient Andhra Pradesh. By integrating advanced technology into forest management and encouraging local community participation, we aim to safeguard our pristine wildlife reserves and expand our green covers sustainably."
                </blockquote>
              </div>
            </div>

            {/* HoFF Column */}
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold flex-none">
                    🌲
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-emerald-950">Head of Forest Force (HoFF)</h3>
                    <p className="text-emerald-600 text-xs font-bold">Principal Chief Conservator of Forests (PCCF) • Aranya Bhavan</p>
                  </div>
                </div>
                <blockquote className="text-emerald-900/80 text-sm italic leading-relaxed border-l-3 border-green-500 pl-4 py-1">
                  "The department functions with an unwavering commitment to enforce forest laws, mitigate human-wildlife conflict, and digitalize citizen services. We are working towards making transit permits and industrial clearances transparent, fast, and completely online."
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Core Statistics */}
        <div className="w-full">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">State Forest Metrics</span>
            <h2 className="text-3xl font-extrabold text-emerald-950" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Core Department Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all text-center">
              <span className="text-4xl font-black text-emerald-600 block mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                37,258 sq km
              </span>
              <h4 className="font-bold text-emerald-950 text-sm mb-2">Total Forest Area</h4>
              <p className="text-emerald-800/70 text-xs leading-relaxed">
                Total recorded forest area under management, accounting for roughly 23% of the state's total geographical landscape.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all text-center">
              <span className="text-4xl font-black text-emerald-600 block mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                12 Circles
              </span>
              <h4 className="font-bold text-emerald-950 text-sm mb-2">Administrative Circles</h4>
              <p className="text-emerald-800/70 text-xs leading-relaxed">
                Territorial units supervising the implementation of central and state wildlife protection strategies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all text-center">
              <span className="text-4xl font-black text-emerald-600 block mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                43 Divisions
              </span>
              <h4 className="font-bold text-emerald-950 text-sm mb-2">Forest Divisions</h4>
              <p className="text-emerald-800/70 text-xs leading-relaxed">
                Active field-level administrative setups managing local beats, ranges, and protective check-posts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all text-center">
              <span className="text-4xl font-black text-emerald-600 block mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                421.43 sq km
              </span>
              <h4 className="font-bold text-emerald-950 text-sm mb-2">Coastal Mangroves</h4>
              <p className="text-emerald-800/70 text-xs leading-relaxed">
                Rich coastal mangrove forests, protecting the state’s shoreline and nourishing vital marine life breeding grounds.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: About AP Forests & Biodiversity */}
        <div className="w-full bg-emerald-50/40 rounded-3xl p-8 border border-emerald-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-200 h-[340px] shadow-lg">
              <Image
                src="/ap-forest-officers.png"
                alt="AP Forest Rangers and Biodiversity Protection"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs font-bold text-emerald-100">
                🌲 Field Officers on Eastern Ghats Conservation Duty
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">Biodiversity & Heritage</span>
            <h2 className="text-3xl font-extrabold text-emerald-950 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              The Green Legacy of the Eastern Ghats
            </h2>
            <p className="text-emerald-800/80 text-sm sm:text-base leading-relaxed">
              Andhra Pradesh boasts a diverse range of ecological zones, stretching from the dense, dry deciduous canopies of the Nallamala hills to the expansive coastal wetlands. The state is home to more than 2,500 recorded species of flowering plants and provides critical refuge to flagship species like the Bengal Tiger, Indian Leopard, Asian Elephant, and the endemic, highly endangered Golden Gecko. Our continuous conservation projects focus on increasing canopy density, tracking forest fires using satellite geomatics, and maintaining delicate water catchment regions.
            </p>
          </div>
        </div>

        {/* Section 5: Key Wildlife & Conservation Areas */}
        <div className="w-full">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">Protected Reserves</span>
            <h2 className="text-3xl font-extrabold text-emerald-950" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Key Wildlife & Conservation Areas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold flex-none">
                🐅
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Nagarjunasagar Srisailam Tiger Reserve
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed">
                  Spanning across the Nallamala landscape, it stands as India’s largest tiger reserve by area, providing a crucial sanctuary for big cats and diverse flora.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold flex-none">
                🏞️
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Papikonda National Park
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed">
                  A vast tropical riverine ecosystem straddling the Godavari basin, famous for its breathtaking gorges and rich population of endangered birds and bison.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-bold flex-none">
                🐢
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Coringa Wildlife Sanctuary
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed">
                  Located near Kakinada, this sanctuary protects the second-largest stretch of mangrove forests in India and acts as a vital nesting ground for Olive Ridley sea turtles.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold flex-none">
                🦁
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Sri Venkateswara Zoological Park
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed">
                  Situated in Tirupati, it is Asia's second-largest zoo layout, focused on the conservation breeding of rare Eastern Ghats wildlife.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Online Citizen Services */}
        <div className="w-full">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">Digital Services</span>
            <h2 className="text-3xl font-extrabold text-emerald-950" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Online Citizen Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-4">
                  📜
                </div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  National Transit Pass System (NTPS)
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed mb-4">
                  Apply online for inter-state and intra-state transit passes for timber, bamboo, and minor forest produce without manual paperwork.
                </p>
              </div>
              <span className="text-emerald-600 text-xs font-bold hover:underline">Access Service &rarr;</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold mb-4">
                  🏭
                </div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Wood-Based Industries (WBI) Licensing
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed mb-4">
                  Streamlined single-desk portal for new registrations, renewals, and operations setup approvals for sawmills and wood factories.
                </p>
              </div>
              <span className="text-emerald-600 text-xs font-bold hover:underline">Single-Desk Portal &rarr;</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-bold mb-4">
                  🏕️
                </div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Eco-Tourism Bookings
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed mb-4">
                  Explore nature trails, book community-managed forest cottages, and reserve jungle safaris across Maredumilli, Araku, and Srisailam.
                </p>
              </div>
              <span className="text-emerald-600 text-xs font-bold hover:underline">Book Safari / Stay &rarr;</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md shadow-emerald-900/5 hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mb-4">
                  ⚖️
                </div>
                <h3 className="font-extrabold text-emerald-950 text-base mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Public Auctions & Tenders
                </h3>
                <p className="text-emerald-800/70 text-xs leading-relaxed mb-4">
                  Access official documentation, schedules, and digital bids for state timber depot sales and department development contracts.
                </p>
              </div>
              <span className="text-emerald-600 text-xs font-bold hover:underline">View E-Tenders &rarr;</span>
            </div>
          </div>
        </div>

      </main>

      {/* Section 7: Quick Contact Footer */}
      <footer className="w-full bg-emerald-950 text-emerald-100 py-10 px-6 lg:px-12 mt-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-xs text-emerald-200/80">
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Aranya Bhavan HQ</h4>
            <p className="leading-relaxed">
              Aranya Bhavan, Mangalagiri,<br />
              Guntur District, Andhra Pradesh, India.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Email & Support</h4>
            <p className="leading-relaxed">
              Email Support: <a href="mailto:apforest-support@ap.gov.in" className="text-emerald-400 underline">apforest-support@ap.gov.in</a><br />
              Toll-Free Helpline: 1800-425-5909
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider">Official Hours</h4>
            <p className="leading-relaxed">
              Office Hours: 10:00 AM to 05:30 PM<br />
              Working Days: Monday to Saturday
            </p>
          </div>
        </div>

        <div className="w-full border-t border-emerald-900 pt-6 text-center text-xs text-emerald-400/70">
          <p>© 2026 Government of Andhra Pradesh • Environment, Forests, Science & Technology Department • All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
