// Types that don't compile down to javascript

/**
 * We use this for truthiness so it starts at 1. Do we still do it?
 */  
export const enum FileType {
	Header = 1,
	Source = 2,
	Other = 3
}

export const enum IntellisenseMode {
	LockedContext,
	LockedTag,
	UnlockedSwitch
}

export const enum Intellisense {
	Context,
	Tag
}