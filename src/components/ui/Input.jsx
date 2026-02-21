import { forwardRef } from 'react';

export const Input = forwardRef(({ label, icon: Icon, error, ...props }, ref) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {Icon && <Icon size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />}
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={`form-input ${error ? 'input-error' : ''}`}
                {...props}
            />
        </div>
    );
});

Input.displayName = 'Input';
