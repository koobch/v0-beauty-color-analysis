"use client"

import { Button } from "@/components/ui/button"

const PERSONAL_COLOR_TYPE = {
  title: "Winter Mute",
  subtitle: "Cool and sophisticated, elegant impression",
}

const EDDY_COMMENTS = [
  "Your skin has cool undertones with muted depth",
  "Bright colors can overwhelm your natural beauty",
  "Dusty, sophisticated tones bring out your best features",
  "Silver jewelry complements you better than gold",
]

const MAKEUP_COLORS = [
  { name: "Dusty Rose", color: "#C89B9B" },
  { name: "Mauve", color: "#B8879C" },
  { name: "Soft Berry", color: "#A87B8D" },
  { name: "Cool Taupe", color: "#9B8B88" },
]

const FASHION_COLORS = [
  { name: "Slate Blue", color: "#6B7E9E" },
  { name: "Charcoal", color: "#5C6066" },
  { name: "Cool Gray", color: "#9CA3AF" },
  { name: "Navy Mist", color: "#4A5568" },
]

interface ResultScreenProps {
  onColorSelect: (colorName: string, colorValue: string) => void
}

function FabricSwatch({
  color,
  name,
  onClick,
}: {
  color: string
  name: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center group">
      <div className="relative w-14 h-14 rounded-full group-hover:scale-110 transition-transform duration-300">
        {/* Base color layer */}
        <div className="absolute inset-0 rounded-full" style={{ backgroundColor: color }} />
        {/* Subtle fabric texture overlay - soft grain effect */}
        <div
          className="absolute inset-0 rounded-full opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Gentle inner shadow for depth - studio lighting effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.08), inset 0 -1px 2px rgba(255,255,255,0.05)",
          }}
        />
        {/* Soft velvety matte finish - subtle lighting gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)",
          }}
        />
      </div>
      <span className="text-[10px] text-neutral-600 mt-1.5 font-light">{name}</span>
    </button>
  )
}

export default function ResultScreen({ onColorSelect }: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col py-8 px-6">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* Title Section */}
        <div className="text-center mb-6">
          <h1 className="text-[28px] font-light text-neutral-800 mb-2 tracking-tight">{PERSONAL_COLOR_TYPE.title}</h1>
          <p className="text-sm text-neutral-500 font-light">{PERSONAL_COLOR_TYPE.subtitle}</p>
        </div>

        {/* Commentary Section */}
        <div className="mb-6">
          <div className="inline-block bg-[#E8E3DD] px-4 py-1.5 rounded-full mb-3">
            <span className="text-xs font-normal text-neutral-700">Eddy's Comments</span>
          </div>
          <div className="space-y-1.5">
            {EDDY_COMMENTS.map((comment, index) => (
              <p key={index} className="text-[13px] text-neutral-600 font-light leading-relaxed">
                • {comment}
              </p>
            ))}
          </div>
        </div>

        {/* Makeup Color Card Section */}
        <div className="mb-5">
          <h2 className="text-base font-normal text-neutral-800 mb-3">Makeup Color Card</h2>
          <div className="flex gap-3 justify-between mb-3">
            {MAKEUP_COLORS.map((item, index) => (
              <FabricSwatch
                key={index}
                color={item.color}
                name={item.name}
                onClick={() => onColorSelect(item.name, item.color)}
              />
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
            These muted, cool-toned makeup shades enhance your natural elegance without overpowering your features.
          </p>
        </div>

        {/* Fashion Color Card Section */}
        <div className="mb-6">
          <h2 className="text-base font-normal text-neutral-800 mb-3">Fashion Color Card</h2>
          <div className="flex gap-3 justify-between mb-3">
            {FASHION_COLORS.map((item, index) => (
              <FabricSwatch
                key={index}
                color={item.color}
                name={item.name}
                onClick={() => onColorSelect(item.name, item.color)}
              />
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
            Cool, sophisticated neutrals in your wardrobe create a polished look that complements your coloring.
          </p>
        </div>

        {/* Action Button Section */}
        <div className="flex gap-2.5 mt-auto">
          <Button className="flex-1 bg-neutral-800 hover:bg-neutral-900 text-white rounded-full py-5 text-[13px] font-normal shadow-sm">
            Save Results
          </Button>
          <Button
            variant="outline"
            className="flex-1 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 rounded-full py-5 text-[13px] font-normal"
          >
            Share with Friends
          </Button>
        </div>
      </div>
    </div>
  )
}
