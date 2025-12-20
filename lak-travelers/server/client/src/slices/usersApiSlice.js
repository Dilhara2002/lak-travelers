// src/slices/usersApiSlice.js

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    
    // ✅ මේ කොටස අලුතින් එකතු කරන්න
    sendOtp: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/send-otp`,
        method: 'POST',
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`, // POST /api/users
        method: 'POST',
        body: data,
      }),
    }),
    
    // ... අනෙකුත් endpoints
  }),
});

// ✅ පල්ලෙහා මේක Export කරන්නත් අමතක කරන්න එපා
export const { 
  useLoginMutation, 
  useSendOtpMutation, // 👈 මේක Register.jsx එකේදී පාවිච්චි කරනවා
  useRegisterMutation,
  // ...
} = usersApiSlice;