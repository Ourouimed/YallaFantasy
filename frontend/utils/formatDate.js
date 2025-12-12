export const formatLocalTime = (dateString) => {
        const dateObj = new Date(dateString); 
        
        if (isNaN(dateObj.getTime())) return 'N/A';

        return dateObj.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
        });
};

export const formatForInput = (dateString) => {
        if (!dateString) return '';
        
        // 1. Create a Date object from the UTC string. 
        //    The JS Date object now internally holds the correct UTC time, 
        //    but its methods like getHours() and getMinutes() return values relative to the user's local timezone.
        const dateObj = new Date(dateString);

        // 2. Use ISO string methods to get the required local format.
        // .toISOString() returns UTC (e.g., 2025-12-24T14:27:00.000Z)
        // To get the local time, we have to manually calculate the offset. 
        
        // A more reliable way is to leverage helper functions, but for a manual fix:
        
        // Calculate the local date-time string part
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        // This creates the required YYYY-MM-DDThh:mm format, 
        // which represents the time in the USER's local time zone.
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };