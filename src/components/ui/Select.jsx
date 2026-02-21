import { forwardRef } from 'react';

export const Select = forwardRef(({ label, icon: Icon, error, children, ...props }, ref) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {Icon && <Icon size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />}
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={`form-input ${error ? 'input-error' : ''}`}
                {...props}
            >
                {children}
            </select>
        </div>
    );
});

Select.displayName = 'Select';
