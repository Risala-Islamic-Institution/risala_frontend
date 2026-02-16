import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl transition-all duration-300 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus:ring-primary",
        secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary",
        accent: "bg-accent text-primary hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 focus:ring-accent",
        outline: "border-2 border-primary/20 text-primary hover:bg-primary/5 focus:ring-primary",
        ghost: "bg-transparent text-secondary/60 hover:text-secondary hover:bg-neutral/10",
        danger: "bg-error/10 text-error hover:bg-error/20",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs tracking-wide uppercase",
        md: "px-5 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {children}
        </button>
    );
};
