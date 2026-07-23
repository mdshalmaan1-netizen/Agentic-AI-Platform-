export default function Button({
  children,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  }
  return (
    <button className={`${variants[variant]} inline-flex items-center justify-center gap-2 ${className}`} {...props}>
      {Icon && <Icon className="text-base" />}
      {children}
    </button>
  )
}
