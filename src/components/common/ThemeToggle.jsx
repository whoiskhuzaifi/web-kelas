import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ORDER = ['light', 'dark', 'system'];
const META = {
  light: { icon: Sun, label: 'Tema terang' },
  dark: { icon: Moon, label: 'Tema gelap' },
  system: { icon: Monitor, label: 'Tema mengikuti sistem' },
};

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const { icon: Icon, label } = META[mode];
  const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => setMode(next)}
      className="btn btn-ghost h-10 w-10 p-0"
      aria-label={`${label}. Klik untuk beralih ke ${META[next].label.toLowerCase()}.`}
      title={label}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
