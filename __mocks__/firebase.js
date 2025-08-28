export const auth = {};

export const RecaptchaVerifier = jest.fn().mockImplementation(() => ({
  render: jest.fn(),
}));

export const signInWithPhoneNumber = jest.fn(() =>
  Promise.resolve({
    confirm: jest.fn(() => Promise.resolve({ user: { uid: "12345" } })),
  })
);
