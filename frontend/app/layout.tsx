import type { Metadata } from 'next';
import '@fontsource/noto-sans-devanagari/devanagari-400.css';
import '@fontsource/noto-sans-devanagari/devanagari-600.css';
import './globals.css';
export const metadata: Metadata = { title: 'AQI Shield · A little clarity, before you step out', description: 'English and Hindi air-quality companion. Development preview with sample data.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
