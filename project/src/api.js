const BASE_URL = 'https://rz7fp2tv-8006.inc1.devtunnels.ms/';

// Get user ID from session storage
const getUID = () => sessionStorage.getItem('uid');

// Generic fetch wrapper with error handling
export const apiRequest = async (
  endpoint,
  {
    method = 'GET',
    body = null,
    headers = {},
    ...rest
  } = {}
) => {
  const preparedBody =
    body && typeof body === 'object' && !(body instanceof FormData)
      ? JSON.stringify(body)
      : body;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      body: preparedBody,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    });

    const raw = await response.text();
    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = raw;
    }

    if (!response.ok) {
      const message =
        (parsed && parsed.detail) ||
        parsed ||
        `HTTP ${response.status} ${response.statusText}`;
      return { success: false, error: message, status: response.status };
    }

    return { success: true, data: parsed };
  } catch (err) {
    console.error('API Error:', err);
    return { success: false, error: err.message };
  }
};

// Auth endpoints
export const signup = async (name, email, password) => {
  const response = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  
  if (response.success && response.data.user_id) {
    sessionStorage.setItem('uid', response.data.user_id);
  }
  
  return response;
};

export const login = async (email, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.success && response.data.user_id) {
    sessionStorage.setItem('uid', response.data.user_id);
  }
  
  return response;
};

// Profile sync endpoint for comprehensive form data
export const syncProfile = async (profileData) => {
  const uid = getUID();
  if (!uid) throw new Error('No user ID found');
  
  return apiRequest(`/profile/sync/${uid}`, {
    method: 'POST',
    body: profileData,
  });
};

// Profile endpoints
export const saveProfile = async (profileData) => {
  const uid = getUID();
  if (!uid) throw new Error('No user ID found');
  
  return apiRequest('/profile', {
    method: 'POST',
    body: JSON.stringify({ user_id: uid, ...profileData }),
  });
};

export const getProfile = async (uid = null) => {
  const userId = uid || getUID();
  if (!userId) throw new Error('No user ID found');
  console.log(`Fetching profile for user ID: ${userId}`);
  return apiRequest(`/profile/get/${userId}`);
};

// Chat endpoint
export const sendMessage = async (message) => {
  const uid = getUID();
  if (!uid) throw new Error('No user ID found');
  
  return apiRequest('/chat', {
    method: 'POST',
    body: JSON.stringify({ user_id: uid, message }),
  });
};

// Voice synthesis endpoint with new payload structure
export const speakMessage = async (text, options = {}) => {
  const uid = getUID();
  if (!uid) throw new Error('No user ID found');
  
  try {
    // First, get the user's profile to fetch voice_id
    const profileResponse = await getProfile(uid);
    let voiceId = null;
    
    if (profileResponse.success && profileResponse.data?.voice_id) {
      voiceId = profileResponse.data.voice_id;
    }
    
    // Prepare the payload according to the new structure
    const payload = {
      user_id: uid,
      message: text,
      voice_id: voiceId || options.voice_id || "default",
      text: text,
      model_id: options.model_id || "eleven_multilingual_v2",
      voice_settings: options.voice_settings || JSON.stringify({
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      }),
      language: options.language || "en"
    };

    const response = await fetch(`${BASE_URL}/chat/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    return { success: true, data: audioBlob };
  } catch (err) {
    console.error('Speech API Error:', err);
    return { success: false, error: err.message };
  }
};

// Voice clone creation endpoint
export const createVoiceClone = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/voice/ivc/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (err) {
    console.error('Voice Clone Creation Error:', err);
    return { success: false, error: err.message };
  }
};

// Auth utilities
export const isAuthenticated = () => !!getUID();

export const logout = () => {
  sessionStorage.removeItem('uid');
  window.location.href = '/';
};