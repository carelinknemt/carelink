import { createContext, useCallback, useContext, useState  } from 'react';
import type {ReactNode} from 'react';

interface BookingContextType {
    isBookingOpen: boolean;
    openBooking: () => void;
    closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }): ReactNode {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const openBooking = useCallback(() => setIsBookingOpen(true), []);
    const closeBooking = useCallback(() => setIsBookingOpen(false), []);

    return (
        <BookingContext.Provider value={{ isBookingOpen, openBooking, closeBooking }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking(): BookingContextType {
    const context = useContext(BookingContext);

    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }

    return context;
}
