"use client";

import * as React from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import { useTheme } from "next-themes";
import { ExternalLink } from "lucide-react";
import { getCaseStudies, getCategory, getSector } from "@/lib/data";

function markerIcon(color: string) {
  return divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color}55"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function TileLayerForTheme() {
  const { resolvedTheme } = useTheme();
  const map = useMap();
  React.useEffect(() => {
    map.invalidateSize();
  }, [map]);
  const url =
    resolvedTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  return (
    <TileLayer
      url={url}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    />
  );
}

export function WorldMap() {
  const caseStudies = getCaseStudies();

  return (
    <MapContainer center={[20, 10]} zoom={2} scrollWheelZoom className="h-[70vh] w-full rounded-3xl">
      <TileLayerForTheme />
      {caseStudies.map((cs) => {
        const category = getCategory(cs.categoryIds[0]);
        const sector = getSector(cs.sectorIds[0]);
        const color = category?.theme.primary ?? "#059669";
        return (
          <Marker key={cs.id} position={[cs.lat, cs.lng]} icon={markerIcon(color)}>
            <Popup>
              <div className="min-w-48 text-sm">
                <p className="font-semibold">{cs.title}</p>
                <p className="text-xs text-muted-foreground">
                  {cs.country} · {cs.bondSize}
                </p>
                <p className="mt-1.5 text-xs">{cs.impact}</p>
                {sector && (
                  <Link
                    href={`/taxonomy/${sector.categoryId}/${sector.id}`}
                    className="mt-2 block text-xs font-medium text-emerald-700 hover:underline"
                  >
                    View sector criteria →
                  </Link>
                )}
                <a
                  href={cs.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline"
                >
                  Certified Bonds Database <ExternalLink className="size-3" />
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
