interface PhotoTitleModalProps {
  title: string;
  isVisible: boolean;
  position: { x: number; y: number } | null;
}

export function PhotoTitleModal({ title, isVisible, position }: PhotoTitleModalProps) {
  if (!isVisible || !position) return null;

  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -140%)',
      }}
    >
      <div className="bg-white/10 backdrop-blur-md text-white/90 px-3 py-1.5 rounded-full border border-white/20 shadow-lg whitespace-nowrap animate-fade-in-scale">
        <span className="text-xs font-light tracking-wide">
          {title}
        </span>
      </div>
      {/* Small triangle pointer */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 -bottom-1"
        style={{
          width: 0,
          height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderTop: '4px solid rgba(255, 255, 255, 0.1)',
        }}
      />
    </div>
  );
}