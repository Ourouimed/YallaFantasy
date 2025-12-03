const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    
    // Split the URL by '/'. Example: .../teams_flags/abc12345.png
    const parts = url.split('/');
    
    // Get the filename (e.g., 'abc12345.png')
    const filenameWithExtension = parts.pop();
    // Get the filename without extension (e.g., 'abc12345')
    const filename = filenameWithExtension.split('.')[0];
    
    // Get the folder name (e.g., 'teams_flags')
    const folder = parts.pop(); 
    
    // Reconstruct the public ID: 'folder/filename'
    return `${folder}/${filename}`; 
};

module.exports = { getPublicIdFromUrl }