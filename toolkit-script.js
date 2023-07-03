// start
const fs = require("fs");

const titlesFromCommand = process.argv[3];

if (process.argv[2] === undefined) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Invalid command. Use '--all' to run both functions, '--api' to run asyncApis, or '--store' to run reduxStore."
  );

  process.exit(1);
}

if (!titlesFromCommand) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Please provide titles for file generation."
  );

  process.exit(1);
}
const titles = titlesFromCommand?.split(",");

// api
const createAsyncThunkCode = (name) => `
export const create${name} = createAsyncThunk('${name.toLowerCase()}s/create', async ({ state, dispatch, handleClose, handleClear }) => {
  try {
    const URL = \`/${name.toLowerCase()}/admin/new\`;
    const response = await post(URL, state);
    if (response) {
      handleClose();
      handleClear();
      dispatch(activeSnack({ type: 'success', message: '${name.toLowerCase()} created successfully' }));
      return response;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.message }));
    throw error?.response?.data?.message;
  }
});`;
const updateAsyncThunkCode = (name) => `
export const update${name}Details = createAsyncThunk('${name.toLowerCase()}s/update', async ({ state, ${name.toLowerCase()}Id, dispatch, navigate }) => {
  try {
    const URL = \`/${name.toLowerCase()}/admin/\${${name.toLowerCase()}Id}\`;

    const response = await put(URL, state);
    if (response) {
      if (navigate) {
        navigate();
      }
      dispatch(activeSnack({ type: 'success', message: '${name} updated Successfully' }));
      return response;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.message }));
    throw error?.response?.data?.message;
  }
});`;

const getAsyncThunkCode = (name) => `
export const getAll${name} = createAsyncThunk(
  '${name.toLowerCase()}s/list',
  async ({ page, search, dispatch, limit, sortBy, sortDirection }) => {
    try {
      const URL = \`/${name.toLowerCase()}/admin/all?page=\${page && page}&search=\${search && search}&limit=\${limit && limit}&sortBy=\${sortBy && sortBy}&sortDirection=\${sortDirection && sortDirection}\`;

      const URL_DROPDOWN = \`/${name.toLowerCase()}/admin/all\`;

      const response = await get(page ? URL : URL_DROPDOWN);
      if (response) {
        return {
          list: response?.${name.toLowerCase() + "s"},
          total: response?.total,
        };
      }
      return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
    } catch (error) {
      dispatch(activeSnack({ type: 'error', message: error?.response?.data?.message }));
      throw error?.response?.data?.message;
    }
  }
);
`;

const getSingleAsyncThunkCode = (name) => `
export const get${name}Details = createAsyncThunk('${name.toLowerCase()}s/single', async ({ ${name.toLowerCase()}Id, dispatch }) => {
  try {
    const response = await get(\`/${name.toLowerCase()}/admin/\${${name.toLowerCase()}Id}/\`);
    if (response) {
      return response;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.message }));
    throw error?.response?.data?.message;
  }
})`;

const deleteAsyncThunkCode = (name) => `
export const delete${name} = createAsyncThunk('${name.toLowerCase()}s/delete', async ({ ${name.toLowerCase()}Id, dispatch, handleCloseDeleteDialog }) => {
  try {
    const response = await del(\`/${name.toLowerCase()}/admin/${name.toLowerCase()}Id/\`);
    if (response) {
      handleCloseDeleteDialog();
      dispatch(activeSnack({ type: 'success', message: '${name} deleted Successfully' }));
      return response?._id;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.message }));
    throw error?.response?.data?.message;
  }
})`;

// store
const reduxStoreAll = (name) => `
import { createSlice } from '@reduxjs/toolkit';
import { create${name}, getAll${name}, get${name}Details, update${name}Details, delete${name} } from '../api/${name.toLowerCase()}';
const covertToJSON = (data) => JSON.parse(JSON.stringify(data));

export const ${name.toLowerCase()}Slice = createSlice({
  name: '${name.toLowerCase()}',
  initialState: {
    loading: false,
    error: {},
    // ${name.toLowerCase()}
    ${name.toLowerCase()}List: {},
    ${name.toLowerCase()}DropList: [],
    ${name.toLowerCase()}Details: {},
  },
  reducers: {
    clear${name}Error: (state) => {
      state.error = true;
    },
  },
  extraReducers: {
    // create ${name.toLowerCase()} details
    [create${name}.pending]: (state) => {
      state.loading = true;
    },
    [create${name}.fulfilled]: (state, action) => {
      const jsonState = covertToJSON(state)?.${name.toLowerCase()}List;
      const modified${name}List = {
        ...jsonState,
        list: Array.isArray(jsonState?.list) ? [...jsonState?.list, action.payload] : [action.payload],
      };
      state.loading = false;
      state.${name.toLowerCase()}Details = action.payload;
      state.${name.toLowerCase()}List = modified${name}List;
      state.error = {};
    },
    [create${name}.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // get all ${name.toLowerCase()}
    [getAll${name}.pending]: (state) => {
      state.loading = true;
    },
    [getAll${name}.fulfilled]: (state, action) => {
      state.loading = false;
      state.${name.toLowerCase()}List = action.payload;
      state.error = {};
    },
    [getAll${name}.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // get single ${name.toLowerCase()} details
    [get${name}Details.pending]: (state) => {
      state.loading = true;
    },
    [get${name}Details.fulfilled]: (state, action) => {
      state.loading = false;
      state.${name.toLowerCase()}Details = action.payload;
      state.error = {};
    },
    [get${name}Details.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    // update ${name.toLowerCase()} details
    [update${name}Details.pending]: (state) => {
      state.loading = true;
    },
    [update${name}Details.fulfilled]: (state, action) => {
      state.loading = false;
      state.${name.toLowerCase()}Details = action.payload;
      state.error = {};
    },
    [update${name}Details.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    [delete${name}.pending]: (state) => {
      state.loading = true;
    },
    [delete${name}.fulfilled]: (state, action) => {
      const jsonState = covertToJSON(state)?.${name.toLowerCase()}List;
      const modified${name}List = {
        ...jsonState,
        list: jsonState.list?.filter((${name.toLowerCase()}) => ${name.toLowerCase()}._id !== action.payload),
      };
      state.loading = false;
      state.${name.toLowerCase()}List = modified${name}List;
      state.error = {};
    },
    [delete${name}.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});
export const { clear${name}Error } = ${name.toLowerCase()}Slice.actions;

export default ${name.toLowerCase()}Slice.reducer;
`;

const writeFile = (fileName, code) => {
  if (fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, code, { flag: "w" });
    console.log(`File replaced: ${fileName}`);
  } else {
    fs.writeFileSync(fileName, code);
    console.log(`File created: ${fileName}`);
  }
};

const asyncApis = () => {
  const top = `
  import { createAsyncThunk } from '@reduxjs/toolkit';
  import { activeSnack } from '../store/common';
  import { del, get, post, put } from './http';
  `;
  titles?.map((name) => {
    if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `Invalid file name: ${name}. The first letter should be capitalized.`
      );
      return;
    }

    const fileName = `${name}.js`;
    let baseCode =
      createAsyncThunkCode(name) +
      updateAsyncThunkCode(name) +
      getAsyncThunkCode(name) +
      getSingleAsyncThunkCode(name) +
      deleteAsyncThunkCode(name);

    writeFile(
      `src/server/api/${fileName}`,
      `
    ${top}
    
    ${baseCode}`
    );

    console.log(`File generated successfully for ${name}.`);
  });
};

const reduxStore = () => {
  // titles?.map((name) => {
  //   if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
  //     console.error(
  //       "\x1b[31m%s\x1b[0m",
  //       `Invalid file name: ${name}. The first letter should be capitalized.`
  //     );
  //     return;
  //   }
  //   const code = reduxStoreAll(name);
  //   const fileName = `src/server/store/${name.toLowerCase()}.js`;
  //   writeFile(fileName, code);

  //   console.log(`File generated successfully for ${name}.`);
  //   return `${name.toLowerCase()}s: ${name}Reducer,`;
  // });
  const reducerEntries = titles?.map((name) => {
    if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
      console.error(
        "\x1b[31m%s\x1b[0m",
        `Invalid file name: ${name}. The first letter should be capitalized.`
      );
      return "";
    }
    const code = reduxStoreAll(name);
    const fileName = `src/server/store/${name.toLowerCase()}.js`;
    writeFile(fileName, code);

    console.log(`File generated successfully for ${name}.`);

    return `${name.toLowerCase()}s: ${name}Reducer,`;
  });

  const reducerEntriesString = reducerEntries?.join("\n  ");

  const storeContent = `
import { configureStore } from '@reduxjs/toolkit';
${titles
  ?.map((name) => `import ${name}Reducer from './${name.toLowerCase()}';`)
  .join("\n")}
export default configureStore({
  reducer: {
    ${reducerEntriesString}
  },
});`;

  const storeFileName = `src/server/store/store.js`;
  writeFile(storeFileName, storeContent);

  console.log("Store file generated successfully.");
};

const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.warn(`Folder created: ${folderPath}`);
  } else {
    console.warn(`Folder already exists: ${folderPath}`);
  }
};

// package handler
const createFoldersAndFiles = () => {
  // Create folders
  createFolderIfNotExists("src");
  createFolderIfNotExists("src/server");
  createFolderIfNotExists("src/server/store");
  createFolderIfNotExists("src/server/api");

  if (process.argv[2] === "--all") {
    asyncApis();
    reduxStore();
  } else if (process.argv[2] === "--api") {
    asyncApis();
  } else if (process.argv[2] === "--store") {
    reduxStore();
  } else {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Invalid command. Use '--all' to run both functions, '--api' to run asyncApis, or '--store' to run reduxStore."
    );
  }

  console.log("Happy Hacking! 🔥 Osperb --ameen😍");
};

createFoldersAndFiles();
