type SharedLinkBannerProps = {
  visible: boolean;
};

export function SharedLinkBanner({ visible }: SharedLinkBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="border-b border-indigo-100 bg-indigo-50 px-6 py-2 text-xs text-indigo-800">
      Scénario ouvert depuis un lien partagé — vous pouvez le modifier
      librement.
    </div>
  );
}
