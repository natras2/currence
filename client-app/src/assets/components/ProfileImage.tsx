// Packages
import hash from 'string-hash'
import color from 'tinycolor2'

export default function ProfileImage(props: any) {
  var { uid, firstLetters, dimension } = props;

  const n = hash(uid);
  const c1 = color({ h: n % 360, s: 0.95, l: 0.5 });
  const c1_ = c1.toHexString();
  const c2 = c1.triad()[1].toHexString();

  return (
    <div id='profile-picture' style={{ width: (dimension * 1) }}>
      <div className='letters' style={{ fontSize: (dimension / 5 * 2) }}>{firstLetters}</div>
      <svg width={dimension} height={dimension} style={{ borderRadius: (dimension * 1) }} viewBox="0 0 80 80">
        <defs>
          <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id={uid}>
            <stop stopColor={c1_} offset="0%"></stop>
            <stop stopColor={c2} offset="100%"></stop>
          </linearGradient>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none">
          <rect fill={`url(#${uid})`} x="0" y="0" width="80" height="80" />
        </g>
      </svg>
    </div>
  );
}