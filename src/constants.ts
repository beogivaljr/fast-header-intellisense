// Potentially shared values that never change

// *** FUL = full uri address, CAT = Category, SUBCAT = Subcategory, SET = Setting, VAL = value
export const URI_SEPARATOR = '.';

export const EXTENSION_NAME = "FHIntellisense";

export const URI_CAT_FHINTELLISENSE = "fhIntellisense";
export const URI_CAT_C_CPP = "C_Cpp";

export const URI_SUBCAT_CONTEXT = "context";
export const URI_SUBCAT_ACTION = "action";

export const URI_SET_INTELLISENSE_ENGINE = "intelliSenseEngine";

export const URI_VAL_TAGPARSER = "Tag Parser";
export const URI_VAL_DEFAULT = "default";
export const URI_VAL_DISABLED = "disabled";
export const URI_VAL_LOCK_TOGGLE = "lockToggle";

export const URI_FUL_RELOAD_WINDOW = "workbench.action.reloadWindow";
export const URI_FUL_FHI_LOCK = [URI_CAT_FHINTELLISENSE, URI_VAL_LOCK_TOGGLE].join(URI_SEPARATOR);


export const CODICON_TAG = "$(database)";
export const CODICON_AWARE = "$(flame)";
export const CODICON_LOCK = "$(lock)";
export const CODICON_UNLOCK = "$(unlock)";
export const CODICON_PROCESSING = "$(sync)";

export const TOGGLED_STATUS_PRIORITY = -1000;

export const UPDATE_WORKSPACE_CONFIG = false;
