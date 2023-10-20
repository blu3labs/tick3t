import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  provider: null,
  signer: null,
  chainId: null,
  walletAddress: null,
  web3AuthModalPack: null,
  activeAddress: localStorage.getItem("activeAddress") || null,
  isAbstract: localStorage.getItem("abstractAccount") || false,
  safeAuthSignInResponse:
    JSON.parse(localStorage.getItem("safe-auth-sign-in-response")) || null,
};

export const handleLogin = createAsyncThunk(
  "handleLogin",
  async ({ web3AuthModalPack }) => {
    try {
      if (!web3AuthModalPack) {
        return;
      }
      const signInInfo = await web3AuthModalPack.signIn();

      return signInInfo;
    } catch (err) {
      console.log(err);
    }
  }
);

export const handleLogout = createAsyncThunk(
  "handleLogout",
  async ({ web3AuthModalPack }) => {
    try {
      if (!web3AuthModalPack) {
        return;
      }
      await web3AuthModalPack.signOut();
    } catch (err) {
      console.log(err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProvider: (state, action) => {
      state.provider = action.payload;
    },

    setSigner: (state, action) => {
      state.signer = action.payload;
    },

    setChainId: (state, action) => {
      state.chainId = action.payload;
    },

    setIsAbstract: (state, action) => {
      state.isAbstract = action.payload;
      localStorage.setItem("abstractAccount", action.payload);
    },

    setActiveAddress: (state, action) => {
      state.activeAddress = action.payload;
    localStorage.setItem("activeAddress", action.payload);


    },
    setSafeAuthSignInResponse: (state, action) => {
        state.safeAuthSignInResponse = action.payload;
        localStorage.setItem(
          "safe-auth-sign-in-response",
          JSON.stringify(action.payload)
        );
        },

    setWeb3AuthModalPack: (state, action) => {
      state.web3AuthModalPack = action.payload;
    },

    walletController: (state, action) => {
      let localStrgAbstract = localStorage.getItem("abstractAccount");
      let localStrgActive = localStorage.getItem("activeAddress");

      if (localStrgAbstract) {
        state.isAbstract = localStrgAbstract === "true" ? true : false;
      } else {
        state.isAbstract = false;
        localStorage.setItem("abstractAccount", false);
      }

      if (localStrgActive) {
        state.activeAddress = localStrgActive;
      } else {
        state.activeAddress = state.safeAuthSignInResponse?.eoa || null;
        localStorage.setItem(
          "activeAddress",
          state.safeAuthSignInResponse?.eoa || null
        );
      }
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  extraReducers(builder) {
    builder.addCase(handleLogin.fulfilled, (state, action) => {
      state.safeAuthSignInResponse = action.payload;
      let wallet = action.payload?.eoa;

      let localWallet = localStorage.getItem("walletAddress");
      if (localWallet) {
        if (wallet?.toLowerCase() !== localWallet?.toLowerCase()) {
          state.activeAddress = wallet;
          state.isAbstract = false;
          localStorage.setItem("abstractAccount", false);
          localStorage.setItem("activeAddress", wallet);
        }
      }

      localStorage.setItem("walletAddress", wallet);
      localStorage.setItem(
        "safe-auth-sign-in-response",
        JSON.stringify(action.payload)
      );
    });

    builder.addCase(handleLogout.fulfilled, (state, action) => {
      state.safeAuthSignInResponse = null;
      localStorage.removeItem("safe-auth-sign-in-response");
    });
  },
});

export const {
  setProvider,
  setSigner,
  setChainId,
  setIsAbstract,
  setWeb3AuthModalPack,
  walletController,
  setActiveAddress,
  setSafeAuthSignInResponse,
} = authSlice.actions;
export default authSlice.reducer;
