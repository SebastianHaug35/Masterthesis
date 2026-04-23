import { m as derived, f as attributes, l as bind_props, L as on, F as spread_props, E as props_id, j as ensure_array_like, d as sanitize_props, e as escape_html, g as attr, h as stringify, i as attr_class, u as unsubscribe_stores, k as store_get } from "../../../../../chunks/root.js";
import { p as page } from "../../../../../chunks/index2.js";
import { b as base } from "../../../../../chunks/server.js";
import "../../../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import { I as IconOmni } from "../../../../../chunks/IconOmni.js";
import { I as IconFast, a as IconCheap } from "../../../../../chunks/IconCheap.js";
import { u as useSettingsStore } from "../../../../../chunks/settings2.js";
import { u as styleToString, m as mergeProps, v as boxAutoReset, x as getNextMatch, y as Context, z as attachRef, A as DOMContext, B as DOMTypeahead, E as ARROW_UP, G as ARROW_DOWN, H as ENTER, I as SPACE, T as TAB, J as PAGE_UP, K as HOME, L as PAGE_DOWN, N as END, O as next, Q as prev, R as forward, U as backward, w as watch, V as isIOS, W as boolToTrueOrUndef, X as afterTick, Y as boolToEmptyStrOrUndef, Z as getDataOpenClosed, _ as boolToStr, h as getFloatingContentCSSVars, $ as PresenceManager, b as boxWith, a0 as createBitsAttrs, c as createId, n as noop, P as Popper_layer_force_mount, f as Popper_layer, F as Floating_layer, k as Floating_layer_anchor, C as CopyToClipBoardBtn, r as Portal, s as Check, t as Copy } from "../../../../../chunks/check.js";
import { A as Arrow_up_right } from "../../../../../chunks/arrow-up-right.js";
import { h as html } from "../../../../../chunks/html.js";
import { PROVIDERS_HUB_ORGS } from "@huggingface/inference";
import "@sveltejs/kit/internal";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/client.js";
import { u as usePublicConfig } from "../../../../../chunks/PublicConfig.svelte.js";
import { S as Switch } from "../../../../../chunks/Switch.js";
const srOnlyStyles = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
  transform: "translateX(-100%)"
};
const srOnlyStylesString = styleToString(srOnlyStyles);
class Previous {
  #previousCallback = () => void 0;
  #previous = derived(() => this.#previousCallback());
  constructor(getter, initialValue) {
    let actualPrevious = void 0;
    if (initialValue !== void 0) actualPrevious = initialValue;
    this.#previousCallback = () => {
      try {
        return actualPrevious;
      } finally {
        actualPrevious = getter();
      }
    };
  }
  get current() {
    return this.#previous();
  }
}
function Hidden_input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, $$slots, $$events, ...restProps } = $$props;
    const mergedProps = derived(() => mergeProps(restProps, {
      "aria-hidden": "true",
      tabindex: -1,
      style: srOnlyStylesString
    }));
    if (mergedProps().type === "checkbox") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<input${attributes({ ...mergedProps(), value }, void 0, void 0, void 0, 4)}/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<input${attributes({ value, ...mergedProps() }, void 0, void 0, void 0, 4)}/>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { value });
  });
}
class DataTypeahead {
  #opts;
  #candidateValues = derived(() => this.#opts.candidateValues());
  #search;
  constructor(opts) {
    this.#opts = opts;
    this.#search = boxAutoReset("", { afterMs: 1e3, getWindow: this.#opts.getWindow });
    this.handleTypeaheadSearch = this.handleTypeaheadSearch.bind(this);
    this.resetTypeahead = this.resetTypeahead.bind(this);
  }
  handleTypeaheadSearch(key) {
    if (!this.#opts.enabled() || !this.#candidateValues().length) return;
    this.#search.current = this.#search.current + key;
    const currentItem = this.#opts.getCurrentItem();
    const currentMatch = this.#candidateValues().find((item) => item === currentItem) ?? "";
    const values = this.#candidateValues().map((item) => item ?? "");
    const nextMatch = getNextMatch(values, this.#search.current, currentMatch);
    const newItem = this.#candidateValues().find((item) => item === nextMatch);
    if (newItem) {
      this.#opts.onMatch(newItem);
    }
    return newItem;
  }
  resetTypeahead() {
    this.#search.current = "";
  }
}
const FIRST_KEYS = [ARROW_DOWN, PAGE_UP, HOME];
const LAST_KEYS = [ARROW_UP, PAGE_DOWN, END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
const selectAttrs = createBitsAttrs({
  component: "select",
  parts: [
    "trigger",
    "content",
    "item",
    "viewport",
    "scroll-up-button",
    "scroll-down-button",
    "group",
    "group-label",
    "separator",
    "arrow",
    "input",
    "content-wrapper",
    "item-text",
    "value"
  ]
});
const SelectRootContext = new Context("Select.Root | Combobox.Root");
const SelectGroupContext = new Context("Select.Group | Combobox.Group");
const SelectContentContext = new Context("Select.Content | Combobox.Content");
class SelectBaseRootState {
  opts;
  touchedInput = false;
  inputNode = null;
  contentNode = null;
  contentPresence;
  viewportNode = null;
  triggerNode = null;
  valueId = "";
  highlightedNode = null;
  #highlightedValue = derived(() => {
    if (!this.highlightedNode) return null;
    return this.highlightedNode.getAttribute("data-value");
  });
  get highlightedValue() {
    return this.#highlightedValue();
  }
  set highlightedValue($$value) {
    return this.#highlightedValue($$value);
  }
  #highlightedId = derived(() => {
    if (!this.highlightedNode) return void 0;
    return this.highlightedNode.id;
  });
  get highlightedId() {
    return this.#highlightedId();
  }
  set highlightedId($$value) {
    return this.#highlightedId($$value);
  }
  #highlightedLabel = derived(() => {
    if (!this.highlightedNode) return null;
    return this.highlightedNode.getAttribute("data-label");
  });
  get highlightedLabel() {
    return this.#highlightedLabel();
  }
  set highlightedLabel($$value) {
    return this.#highlightedLabel($$value);
  }
  isUsingKeyboard = false;
  isCombobox = false;
  domContext = new DOMContext(() => null);
  constructor(opts) {
    this.opts = opts;
    this.isCombobox = opts.isCombobox;
    this.contentPresence = new PresenceManager({
      ref: boxWith(() => this.contentNode),
      open: this.opts.open,
      onComplete: () => {
        this.opts.onOpenChangeComplete.current(this.opts.open.current);
      }
    });
  }
  setHighlightedNode(node, initial = false) {
    this.highlightedNode = node;
    if (node && (this.isUsingKeyboard || initial)) {
      node.scrollIntoView({ block: this.opts.scrollAlignment.current });
    }
  }
  getCandidateNodes() {
    const node = this.contentNode;
    if (!node) return [];
    return Array.from(node.querySelectorAll(`[${this.getBitsAttr("item")}]:not([data-disabled])`));
  }
  setHighlightedToFirstCandidate(initial = false) {
    this.setHighlightedNode(null);
    let nodes = this.getCandidateNodes();
    if (!nodes.length) return;
    if (this.viewportNode) {
      const viewportRect = this.viewportNode.getBoundingClientRect();
      nodes = nodes.filter((node) => {
        if (!this.viewportNode) return false;
        const nodeRect = node.getBoundingClientRect();
        const isNodeFullyVisible = nodeRect.right < viewportRect.right && nodeRect.left > viewportRect.left && nodeRect.bottom < viewportRect.bottom && nodeRect.top > viewportRect.top;
        return isNodeFullyVisible;
      });
    }
    this.setHighlightedNode(nodes[0], initial);
  }
  getNodeByValue(value) {
    const candidateNodes = this.getCandidateNodes();
    return candidateNodes.find((node) => node.dataset.value === value) ?? null;
  }
  setOpen(open) {
    this.opts.open.current = open;
  }
  toggleOpen() {
    this.opts.open.current = !this.opts.open.current;
  }
  handleOpen() {
    this.setOpen(true);
  }
  handleClose() {
    this.setHighlightedNode(null);
    this.setOpen(false);
  }
  toggleMenu() {
    this.toggleOpen();
  }
  getBitsAttr = (part) => {
    return selectAttrs.getAttr(part, this.isCombobox ? "combobox" : void 0);
  };
}
class SelectSingleRootState extends SelectBaseRootState {
  opts;
  isMulti = false;
  #hasValue = derived(() => this.opts.value.current !== "");
  get hasValue() {
    return this.#hasValue();
  }
  set hasValue($$value) {
    return this.#hasValue($$value);
  }
  #currentLabel = derived(() => {
    if (!this.opts.items.current.length) return "";
    return this.opts.items.current.find((item) => item.value === this.opts.value.current)?.label ?? "";
  });
  get currentLabel() {
    return this.#currentLabel();
  }
  set currentLabel($$value) {
    return this.#currentLabel($$value);
  }
  #candidateLabels = derived(() => {
    if (!this.opts.items.current.length) return [];
    const filteredItems = this.opts.items.current.filter((item) => !item.disabled);
    return filteredItems.map((item) => item.label);
  });
  get candidateLabels() {
    return this.#candidateLabels();
  }
  set candidateLabels($$value) {
    return this.#candidateLabels($$value);
  }
  #dataTypeaheadEnabled = derived(() => {
    if (this.isMulti) return false;
    if (this.opts.items.current.length === 0) return false;
    return true;
  });
  get dataTypeaheadEnabled() {
    return this.#dataTypeaheadEnabled();
  }
  set dataTypeaheadEnabled($$value) {
    return this.#dataTypeaheadEnabled($$value);
  }
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch(() => this.opts.open.current, () => {
      if (!this.opts.open.current) return;
      this.setInitialHighlightedNode();
    });
  }
  includesItem(itemValue) {
    return this.opts.value.current === itemValue;
  }
  toggleItem(itemValue, itemLabel = itemValue) {
    const newValue = this.includesItem(itemValue) ? "" : itemValue;
    this.opts.value.current = newValue;
    if (newValue !== "") {
      this.opts.inputValue.current = itemLabel;
    }
  }
  setInitialHighlightedNode() {
    afterTick(() => {
      if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
      if (this.opts.value.current !== "") {
        const node = this.getNodeByValue(this.opts.value.current);
        if (node) {
          this.setHighlightedNode(node, true);
          return;
        }
      }
      this.setHighlightedToFirstCandidate(true);
    });
  }
}
class SelectMultipleRootState extends SelectBaseRootState {
  opts;
  isMulti = true;
  #hasValue = derived(() => this.opts.value.current.length > 0);
  get hasValue() {
    return this.#hasValue();
  }
  set hasValue($$value) {
    return this.#hasValue($$value);
  }
  constructor(opts) {
    super(opts);
    this.opts = opts;
    watch(() => this.opts.open.current, () => {
      if (!this.opts.open.current) return;
      this.setInitialHighlightedNode();
    });
  }
  includesItem(itemValue) {
    return this.opts.value.current.includes(itemValue);
  }
  toggleItem(itemValue, itemLabel = itemValue) {
    if (this.includesItem(itemValue)) {
      this.opts.value.current = this.opts.value.current.filter((v) => v !== itemValue);
    } else {
      this.opts.value.current = [...this.opts.value.current, itemValue];
    }
    this.opts.inputValue.current = itemLabel;
  }
  setInitialHighlightedNode() {
    afterTick(() => {
      if (!this.domContext) return;
      if (this.highlightedNode && this.domContext.getDocument().contains(this.highlightedNode)) return;
      if (this.opts.value.current.length && this.opts.value.current[0] !== "") {
        const node = this.getNodeByValue(this.opts.value.current[0]);
        if (node) {
          this.setHighlightedNode(node, true);
          return;
        }
      }
      this.setHighlightedToFirstCandidate(true);
    });
  }
}
class SelectRootState {
  static create(props) {
    const { type, ...rest } = props;
    const rootState = type === "single" ? new SelectSingleRootState(rest) : new SelectMultipleRootState(rest);
    return SelectRootContext.set(rootState);
  }
}
class SelectTriggerState {
  static create(opts) {
    return new SelectTriggerState(opts, SelectRootContext.get());
  }
  opts;
  root;
  attachment;
  #domTypeahead;
  #dataTypeahead;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref, (v) => this.root.triggerNode = v);
    this.root.domContext = new DOMContext(opts.ref);
    this.#domTypeahead = new DOMTypeahead({
      getCurrentItem: () => this.root.highlightedNode,
      onMatch: (node) => {
        this.root.setHighlightedNode(node);
      },
      getActiveElement: () => this.root.domContext.getActiveElement(),
      getWindow: () => this.root.domContext.getWindow()
    });
    this.#dataTypeahead = new DataTypeahead({
      getCurrentItem: () => {
        if (this.root.isMulti) return "";
        return this.root.currentLabel;
      },
      onMatch: (label) => {
        if (this.root.isMulti) return;
        if (!this.root.opts.items.current) return;
        const matchedItem = this.root.opts.items.current.find((item) => item.label === label);
        if (!matchedItem) return;
        this.root.opts.value.current = matchedItem.value;
      },
      enabled: () => !this.root.isMulti && this.root.dataTypeaheadEnabled,
      candidateValues: () => this.root.isMulti ? [] : this.root.candidateLabels,
      getWindow: () => this.root.domContext.getWindow()
    });
    this.onkeydown = this.onkeydown.bind(this);
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
    this.onclick = this.onclick.bind(this);
  }
  #handleOpen() {
    this.root.opts.open.current = true;
    this.#dataTypeahead.resetTypeahead();
    this.#domTypeahead.resetTypeahead();
  }
  #handlePointerOpen(_) {
    this.#handleOpen();
  }
  /**
   * Logic used to handle keyboard selection/deselection.
   *
   * If it returns true, it means the item was selected and whatever is calling
   * this function should return early
   *
   */
  #handleKeyboardSelection() {
    const isCurrentSelectedValue = this.root.highlightedValue === this.root.opts.value.current;
    if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
      this.root.handleClose();
      return true;
    }
    if (this.root.highlightedValue !== null) {
      this.root.toggleItem(this.root.highlightedValue, this.root.highlightedLabel ?? void 0);
    }
    if (!this.root.isMulti && !isCurrentSelectedValue) {
      this.root.handleClose();
      return true;
    }
    return false;
  }
  onkeydown(e) {
    this.root.isUsingKeyboard = true;
    if (e.key === ARROW_UP || e.key === ARROW_DOWN) e.preventDefault();
    if (!this.root.opts.open.current) {
      if (e.key === ENTER || e.key === SPACE || e.key === ARROW_DOWN || e.key === ARROW_UP) {
        e.preventDefault();
        this.root.handleOpen();
      } else if (!this.root.isMulti && this.root.dataTypeaheadEnabled) {
        this.#dataTypeahead.handleTypeaheadSearch(e.key);
        return;
      }
      if (this.root.hasValue) return;
      const candidateNodes2 = this.root.getCandidateNodes();
      if (!candidateNodes2.length) return;
      if (e.key === ARROW_DOWN) {
        const firstCandidate = candidateNodes2[0];
        this.root.setHighlightedNode(firstCandidate);
      } else if (e.key === ARROW_UP) {
        const lastCandidate = candidateNodes2[candidateNodes2.length - 1];
        this.root.setHighlightedNode(lastCandidate);
      }
      return;
    }
    if (e.key === TAB) {
      this.root.handleClose();
      return;
    }
    if ((e.key === ENTER || // if we're currently "typing ahead", we don't want to select the item
    // just yet as the item the user is trying to get to may have a space in it,
    // so we defer handling the close for this case until further down
    e.key === SPACE && this.#domTypeahead.search === "") && !e.isComposing) {
      e.preventDefault();
      const shouldReturn = this.#handleKeyboardSelection();
      if (shouldReturn) return;
    }
    if (e.key === ARROW_UP && e.altKey) {
      this.root.handleClose();
    }
    if (FIRST_LAST_KEYS.includes(e.key)) {
      e.preventDefault();
      const candidateNodes2 = this.root.getCandidateNodes();
      const currHighlightedNode = this.root.highlightedNode;
      const currIndex = currHighlightedNode ? candidateNodes2.indexOf(currHighlightedNode) : -1;
      const loop = this.root.opts.loop.current;
      let nextItem;
      if (e.key === ARROW_DOWN) {
        nextItem = next(candidateNodes2, currIndex, loop);
      } else if (e.key === ARROW_UP) {
        nextItem = prev(candidateNodes2, currIndex, loop);
      } else if (e.key === PAGE_DOWN) {
        nextItem = forward(candidateNodes2, currIndex, 10, loop);
      } else if (e.key === PAGE_UP) {
        nextItem = backward(candidateNodes2, currIndex, 10, loop);
      } else if (e.key === HOME) {
        nextItem = candidateNodes2[0];
      } else if (e.key === END) {
        nextItem = candidateNodes2[candidateNodes2.length - 1];
      }
      if (!nextItem) return;
      this.root.setHighlightedNode(nextItem);
      return;
    }
    const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
    const isCharacterKey = e.key.length === 1;
    const isSpaceKey = e.key === SPACE;
    const candidateNodes = this.root.getCandidateNodes();
    if (e.key === TAB) return;
    if (!isModifierKey && (isCharacterKey || isSpaceKey)) {
      const matchedNode = this.#domTypeahead.handleTypeaheadSearch(e.key, candidateNodes);
      if (!matchedNode && isSpaceKey) {
        e.preventDefault();
        this.#handleKeyboardSelection();
      }
      return;
    }
    if (!this.root.highlightedNode) {
      this.root.setHighlightedToFirstCandidate();
    }
  }
  onclick(e) {
    const currTarget = e.currentTarget;
    currTarget.focus();
  }
  onpointerdown(e) {
    if (this.root.opts.disabled.current) return;
    if (e.pointerType === "touch") return e.preventDefault();
    const target = e.target;
    if (target?.hasPointerCapture(e.pointerId)) {
      target?.releasePointerCapture(e.pointerId);
    }
    if (e.button === 0 && e.ctrlKey === false) {
      if (this.root.opts.open.current === false) {
        this.#handlePointerOpen(e);
      } else {
        this.root.handleClose();
      }
    }
  }
  onpointerup(e) {
    if (this.root.opts.disabled.current) return;
    e.preventDefault();
    if (e.pointerType === "touch") {
      if (this.root.opts.open.current === false) {
        this.#handlePointerOpen(e);
      } else {
        this.root.handleClose();
      }
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    disabled: this.root.opts.disabled.current ? true : void 0,
    "aria-haspopup": "listbox",
    "aria-expanded": boolToStr(this.root.opts.open.current),
    "aria-activedescendant": this.root.highlightedId,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "data-disabled": boolToEmptyStrOrUndef(this.root.opts.disabled.current),
    "data-placeholder": this.root.hasValue ? void 0 : "",
    [this.root.getBitsAttr("trigger")]: "",
    onpointerdown: this.onpointerdown,
    onkeydown: this.onkeydown,
    onclick: this.onclick,
    onpointerup: this.onpointerup,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectContentState {
  static create(opts) {
    return SelectContentContext.set(new SelectContentState(opts, SelectRootContext.get()));
  }
  opts;
  root;
  attachment;
  isPositioned = false;
  domContext;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref, (v) => this.root.contentNode = v);
    this.domContext = new DOMContext(this.opts.ref);
    if (this.root.domContext === null) {
      this.root.domContext = this.domContext;
    }
    watch(() => this.root.opts.open.current, () => {
      if (this.root.opts.open.current) return;
      this.isPositioned = false;
    });
    this.onpointermove = this.onpointermove.bind(this);
  }
  onpointermove(_) {
    this.root.isUsingKeyboard = false;
  }
  #styles = derived(() => {
    return getFloatingContentCSSVars(this.root.isCombobox ? "combobox" : "select");
  });
  onInteractOutside = (e) => {
    if (e.target === this.root.triggerNode || e.target === this.root.inputNode) {
      e.preventDefault();
      return;
    }
    this.opts.onInteractOutside.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onEscapeKeydown = (e) => {
    this.opts.onEscapeKeydown.current(e);
    if (e.defaultPrevented) return;
    this.root.handleClose();
  };
  onOpenAutoFocus = (e) => {
    e.preventDefault();
  };
  onCloseAutoFocus = (e) => {
    e.preventDefault();
  };
  get shouldRender() {
    return this.root.contentPresence.shouldRender;
  }
  #snippetProps = derived(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "listbox",
    "aria-multiselectable": this.root.isMulti ? "true" : void 0,
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    [this.root.getBitsAttr("content")]: "",
    style: {
      display: "flex",
      flexDirection: "column",
      outline: "none",
      boxSizing: "border-box",
      pointerEvents: "auto",
      ...this.#styles()
    },
    onpointermove: this.onpointermove,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
  popperProps = {
    onInteractOutside: this.onInteractOutside,
    onEscapeKeydown: this.onEscapeKeydown,
    onOpenAutoFocus: this.onOpenAutoFocus,
    onCloseAutoFocus: this.onCloseAutoFocus,
    trapFocus: false,
    loop: false,
    onPlaced: () => {
      if (this.root.opts.open.current) {
        this.isPositioned = true;
      }
    }
  };
}
class SelectItemState {
  static create(opts) {
    return new SelectItemState(opts, SelectRootContext.get());
  }
  opts;
  root;
  attachment;
  #isSelected = derived(() => this.root.includesItem(this.opts.value.current));
  get isSelected() {
    return this.#isSelected();
  }
  set isSelected($$value) {
    return this.#isSelected($$value);
  }
  #isHighlighted = derived(() => this.root.highlightedValue === this.opts.value.current);
  get isHighlighted() {
    return this.#isHighlighted();
  }
  set isHighlighted($$value) {
    return this.#isHighlighted($$value);
  }
  prevHighlighted = new Previous(() => this.isHighlighted);
  mounted = false;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref);
    watch([() => this.isHighlighted, () => this.prevHighlighted.current], () => {
      if (this.isHighlighted) {
        this.opts.onHighlight.current();
      } else if (this.prevHighlighted.current) {
        this.opts.onUnhighlight.current();
      }
    });
    watch(() => this.mounted, () => {
      if (!this.mounted) return;
      this.root.setInitialHighlightedNode();
    });
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
    this.onpointermove = this.onpointermove.bind(this);
  }
  handleSelect() {
    if (this.opts.disabled.current) return;
    const isCurrentSelectedValue = this.opts.value.current === this.root.opts.value.current;
    if (!this.root.opts.allowDeselect.current && isCurrentSelectedValue && !this.root.isMulti) {
      this.root.handleClose();
      return;
    }
    this.root.toggleItem(this.opts.value.current, this.opts.label.current);
    if (!this.root.isMulti && !isCurrentSelectedValue) {
      this.root.handleClose();
    }
  }
  #snippetProps = derived(() => ({ selected: this.isSelected, highlighted: this.isHighlighted }));
  get snippetProps() {
    return this.#snippetProps();
  }
  set snippetProps($$value) {
    return this.#snippetProps($$value);
  }
  onpointerdown(e) {
    e.preventDefault();
  }
  /**
   * Using `pointerup` instead of `click` allows power users to pointerdown
   * the trigger, then release pointerup on an item to select it vs having to do
   * multiple clicks.
   */
  onpointerup(e) {
    if (e.defaultPrevented || !this.opts.ref.current) return;
    if (e.pointerType === "touch" && !isIOS) {
      on(
        this.opts.ref.current,
        "click",
        () => {
          this.handleSelect();
          this.root.setHighlightedNode(this.opts.ref.current);
        },
        { once: true }
      );
      return;
    }
    e.preventDefault();
    this.handleSelect();
    if (e.pointerType === "touch") {
      this.root.setHighlightedNode(this.opts.ref.current);
    }
  }
  onpointermove(e) {
    if (e.pointerType === "touch") return;
    if (this.root.highlightedNode !== this.opts.ref.current) {
      this.root.setHighlightedNode(this.opts.ref.current);
    }
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "option",
    "aria-selected": this.root.includesItem(this.opts.value.current) ? "true" : void 0,
    "data-value": this.opts.value.current,
    "data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
    "data-highlighted": this.root.highlightedValue === this.opts.value.current && !this.opts.disabled.current ? "" : void 0,
    "data-selected": this.root.includesItem(this.opts.value.current) ? "" : void 0,
    "data-label": this.opts.label.current,
    [this.root.getBitsAttr("item")]: "",
    onpointermove: this.onpointermove,
    onpointerdown: this.onpointerdown,
    onpointerup: this.onpointerup,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectGroupState {
  static create(opts) {
    return SelectGroupContext.set(new SelectGroupState(opts, SelectRootContext.get()));
  }
  opts;
  root;
  labelNode = null;
  attachment;
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.attachment = attachRef(opts.ref);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: "group",
    [this.root.getBitsAttr("group")]: "",
    "aria-labelledby": this.labelNode?.id ?? void 0,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectGroupHeadingState {
  static create(opts) {
    return new SelectGroupHeadingState(opts, SelectGroupContext.get());
  }
  opts;
  group;
  attachment;
  constructor(opts, group) {
    this.opts = opts;
    this.group = group;
    this.attachment = attachRef(opts.ref, (v) => this.group.labelNode = v);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [this.group.root.getBitsAttr("group-label")]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
class SelectHiddenInputState {
  static create(opts) {
    return new SelectHiddenInputState(opts, SelectRootContext.get());
  }
  opts;
  root;
  #shouldRender = derived(() => this.root.opts.name.current !== "");
  get shouldRender() {
    return this.#shouldRender();
  }
  set shouldRender($$value) {
    return this.#shouldRender($$value);
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.onfocus = this.onfocus.bind(this);
  }
  onfocus(e) {
    e.preventDefault();
    if (!this.root.isCombobox) {
      this.root.triggerNode?.focus();
    } else {
      this.root.inputNode?.focus();
    }
  }
  #props = derived(() => ({
    disabled: boolToTrueOrUndef(this.root.opts.disabled.current),
    required: boolToTrueOrUndef(this.root.opts.required.current),
    name: this.root.opts.name.current,
    value: this.opts.value.current,
    onfocus: this.onfocus
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
function Select_hidden_input($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = void 0, autocomplete } = $$props;
    const hiddenInputState = SelectHiddenInputState.create({ value: boxWith(() => value) });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (hiddenInputState.shouldRender) {
        $$renderer3.push("<!--[0-->");
        Hidden_input($$renderer3, spread_props([
          hiddenInputState.props,
          {
            autocomplete,
            get value() {
              return value;
            },
            set value($$value) {
              value = $$value;
              $$settled = false;
            }
          }
        ]));
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { value });
  });
}
function Select_content($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      forceMount = false,
      side = "bottom",
      onInteractOutside = noop,
      onEscapeKeydown = noop,
      children,
      child,
      preventScroll = false,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const contentState = SelectContentState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      onInteractOutside: boxWith(() => onInteractOutside),
      onEscapeKeydown: boxWith(() => onEscapeKeydown)
    });
    const mergedProps = derived(() => mergeProps(restProps, contentState.props));
    if (forceMount) {
      $$renderer2.push("<!--[0-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, { style: contentState.props.style });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer_force_mount($$renderer2, spread_props([
          mergedProps(),
          contentState.popperProps,
          {
            ref: contentState.opts.ref,
            side,
            enabled: contentState.root.opts.open.current,
            id,
            preventScroll,
            forceMount: true,
            shouldRender: contentState.shouldRender,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else if (!forceMount) {
      $$renderer2.push("<!--[1-->");
      {
        let popper = function($$renderer3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, { style: contentState.props.style });
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        };
        Popper_layer($$renderer2, spread_props([
          mergedProps(),
          contentState.popperProps,
          {
            ref: contentState.opts.ref,
            side,
            open: contentState.root.opts.open.current,
            id,
            preventScroll,
            forceMount: false,
            shouldRender: contentState.shouldRender,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Mounted($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { mounted = false, onMountedChange = noop } = $$props;
    bind_props($$props, { mounted });
  });
}
function Select_item($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      value,
      label = value,
      disabled = false,
      children,
      child,
      onHighlight = noop,
      onUnhighlight = noop,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const itemState = SelectItemState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v),
      value: boxWith(() => value),
      disabled: boxWith(() => disabled),
      label: boxWith(() => label),
      onHighlight: boxWith(() => onHighlight),
      onUnhighlight: boxWith(() => onUnhighlight)
    });
    const mergedProps = derived(() => mergeProps(restProps, itemState.props));
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (child) {
        $$renderer3.push("<!--[0-->");
        child($$renderer3, { props: mergedProps(), ...itemState.snippetProps });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div${attributes({ ...mergedProps() })}>`);
        children?.($$renderer3, itemState.snippetProps);
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      Mounted($$renderer3, {
        get mounted() {
          return itemState.mounted;
        },
        set mounted($$value) {
          itemState.mounted = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!---->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { ref });
  });
}
function Select_group($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      children,
      child,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const groupState = SelectGroupState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, groupState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Select_group_heading($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      child,
      children,
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const groupHeadingState = SelectGroupHeadingState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, groupHeadingState.props));
    if (child) {
      $$renderer2.push("<!--[0-->");
      child($$renderer2, { props: mergedProps() });
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attributes({ ...mergedProps() })}>`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { ref });
  });
}
function Select($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = void 0,
      onValueChange = noop,
      name = "",
      disabled = false,
      type,
      open = false,
      onOpenChange = noop,
      onOpenChangeComplete = noop,
      loop = false,
      scrollAlignment = "nearest",
      required = false,
      items = [],
      allowDeselect = false,
      autocomplete,
      children
    } = $$props;
    function handleDefaultValue() {
      if (value !== void 0) return;
      value = type === "single" ? "" : [];
    }
    handleDefaultValue();
    watch.pre(() => value, () => {
      handleDefaultValue();
    });
    let inputValue = "";
    const rootState = SelectRootState.create({
      type,
      value: boxWith(() => value, (v) => {
        value = v;
        onValueChange(v);
      }),
      disabled: boxWith(() => disabled),
      required: boxWith(() => required),
      open: boxWith(() => open, (v) => {
        open = v;
        onOpenChange(v);
      }),
      loop: boxWith(() => loop),
      scrollAlignment: boxWith(() => scrollAlignment),
      name: boxWith(() => name),
      isCombobox: false,
      items: boxWith(() => items),
      allowDeselect: boxWith(() => allowDeselect),
      inputValue: boxWith(() => inputValue, (v) => inputValue = v),
      onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Floating_layer($$renderer3, {
        children: ($$renderer4) => {
          children?.($$renderer4);
          $$renderer4.push(`<!---->`);
        }
      });
      $$renderer3.push(`<!----> `);
      if (Array.isArray(rootState.opts.value.current)) {
        $$renderer3.push("<!--[0-->");
        if (rootState.opts.value.current.length === 0) {
          $$renderer3.push("<!--[0-->");
          Select_hidden_input($$renderer3, { autocomplete });
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(rootState.opts.value.current);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let item = each_array[$$index];
            Select_hidden_input($$renderer3, { value: item, autocomplete });
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
        Select_hidden_input($$renderer3, {
          autocomplete,
          get value() {
            return rootState.opts.value.current;
          },
          set value($$value) {
            rootState.opts.value.current = $$value;
            $$settled = false;
          }
        });
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { value, open });
  });
}
function Select_trigger($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const uid = props_id($$renderer2);
    let {
      id = createId(uid),
      ref = null,
      child,
      children,
      type = "button",
      $$slots,
      $$events,
      ...restProps
    } = $$props;
    const triggerState = SelectTriggerState.create({
      id: boxWith(() => id),
      ref: boxWith(() => ref, (v) => ref = v)
    });
    const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
    if (Floating_layer_anchor) {
      $$renderer2.push("<!--[-->");
      Floating_layer_anchor($$renderer2, {
        id,
        ref: triggerState.opts.ref,
        children: ($$renderer3) => {
          if (child) {
            $$renderer3.push("<!--[0-->");
            child($$renderer3, { props: mergedProps() });
            $$renderer3.push(`<!---->`);
          } else {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<button${attributes({ ...mergedProps() })}>`);
            children?.($$renderer3);
            $$renderer3.push(`<!----></button>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
      $$renderer2.push("<!--]-->");
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push("<!--]-->");
    }
    bind_props($$props, { ref });
  });
}
function Chat($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84Z"/><path fill="currentColor" d="M8 10h16v2H8zm0 6h10v2H8z"/>`)}</svg>`);
}
function Code($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="m31 16l-7 7l-1.41-1.41L28.17 16l-5.58-5.59L24 9zM1 16l7-7l1.41 1.41L3.83 16l5.58 5.59L8 23zm11.42 9.484L17.64 6l1.932.517L14.352 26z"/>`)}</svg>`);
}
function Chevron_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z"/>`)}</svg>`);
}
function Reset($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M18 28A12 12 0 1 0 6 16v6.2l-3.6-3.6L1 20l6 6l6-6l-1.4-1.4L8 22.2V16a10 10 0 1 1 10 10Z"/>`)}</svg>`);
}
function Magic_wand_filled($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  $$renderer.push(`<svg${attributes(
    {
      viewBox: "0 0 32 32",
      width: "1.2em",
      height: "1.2em",
      ...$$sanitized_props
    },
    void 0,
    void 0,
    void 0,
    3
  )}>${html(`<path fill="currentColor" d="M29.414 24L12 6.586a2.05 2.05 0 0 0-2.828 0L6.586 9.172a2 2 0 0 0 0 2.828l17.413 17.414a2 2 0 0 0 2.828 0l2.587-2.586a2 2 0 0 0 0-2.828M8 10.586L10.586 8l5 5l-2.587 2.587zM2 16l2-2l2 2l-2 2zM14 4l2-2l2 2l-2 2zM2 4l2-2l2 2l-2 2z"/>`)}</svg>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const publicConfig = usePublicConfig();
    const settings = useSettingsStore();
    const modelId = derived(() => page.params.model ?? "");
    function getToolsOverride() {
      return store_get($$store_subs ??= {}, "$settings", settings).toolsOverrides?.[modelId()] ?? Boolean(model().supportsTools);
    }
    function setToolsOverride(v) {
      settings.update((s) => ({
        ...s,
        toolsOverrides: { ...s.toolsOverrides, [modelId()]: v }
      }));
    }
    function getMultimodalOverride() {
      return store_get($$store_subs ??= {}, "$settings", settings).multimodalOverrides?.[modelId()] ?? Boolean(model()?.multimodal);
    }
    function setMultimodalOverride(v) {
      settings.update((s) => ({
        ...s,
        multimodalOverrides: { ...s.multimodalOverrides, [modelId()]: v }
      }));
    }
    function getHidePromptExamples() {
      return store_get($$store_subs ??= {}, "$settings", settings).hidePromptExamples?.[modelId()] ?? false;
    }
    function setHidePromptExamples(v) {
      settings.update((s) => ({
        ...s,
        hidePromptExamples: { ...s.hidePromptExamples, [modelId()]: v }
      }));
    }
    function getProviderOverride() {
      return store_get($$store_subs ??= {}, "$settings", settings).providerOverrides?.[modelId()] ?? "auto";
    }
    function setProviderOverride(v) {
      settings.update((s) => ({
        ...s,
        providerOverrides: { ...s.providerOverrides, [modelId()]: v }
      }));
    }
    function getCustomPrompt() {
      return store_get($$store_subs ??= {}, "$settings", settings).customPrompts?.[modelId()] ?? "";
    }
    function getCustomPromptEnabled() {
      return store_get($$store_subs ??= {}, "$settings", settings).customPromptsEnabled?.[modelId()] ?? true;
    }
    function setCustomPromptEnabled(v) {
      settings.update((s) => ({
        ...s,
        customPromptsEnabled: { ...s.customPromptsEnabled, [modelId()]: v }
      }));
    }
    let hasCustomPreprompt = derived(() => store_get($$store_subs ??= {}, "$settings", settings).customPrompts[modelId()] !== page.data.models.find((el) => el.id === modelId())?.preprompt);
    let model = derived(() => page.data.models.find((el) => el.id === modelId()));
    let providerList = derived(() => model()?.providers ?? []);
    const PROVIDER_POLICIES = [
      { value: "auto", label: "Auto (your HF preference order)" },
      { value: "fastest", label: "Fastest (highest throughput)" },
      { value: "cheapest", label: "Cheapest (lowest cost)" }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      var bind_get = getCustomPromptEnabled;
      var bind_set = setCustomPromptEnabled;
      var bind_get_1 = getToolsOverride;
      var bind_set_1 = setToolsOverride;
      var bind_get_2 = getMultimodalOverride;
      var bind_set_2 = setMultimodalOverride;
      $$renderer3.push(`<div class="flex flex-col items-start"><div class="mb-4 flex flex-col gap-0.5"><h2 class="text-base font-semibold md:text-lg">${escape_html(model().displayName)}</h2> `);
      if (model().description) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<p class="line-clamp-2 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">${escape_html(model().description)}</p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="mb-4 flex flex-wrap items-center gap-1.5"><button class="flex w-fit items-center rounded-full bg-black px-3 py-1.5 text-sm !text-white shadow-sm hover:bg-black/90 dark:bg-white/80 dark:!text-gray-900 dark:hover:bg-white/90" name="Activate model">`);
      Chat($$renderer3, { class: "mr-1.5 text-sm" });
      $$renderer3.push(`<!----> New chat</button> `);
      if (model().modelUrl) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<a${attr("href", model().modelUrl || "https://huggingface.co/" + model().name)} target="_blank" rel="noreferrer" class="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">`);
        Arrow_up_right($$renderer3, { class: "mr-1.5 shrink-0 text-xs " });
        $$renderer3.push(`<!----> Model page</a>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (model().datasetName || model().datasetUrl) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<a${attr("href", model().datasetUrl || "https://huggingface.co/datasets/" + model().datasetName)} target="_blank" rel="noreferrer" class="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">`);
        Arrow_up_right($$renderer3, { class: "mr-1.5 shrink-0 text-xs " });
        $$renderer3.push(`<!----> Dataset page</a>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (model().websiteUrl) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<a${attr("href", model().websiteUrl)} target="_blank" class="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60" rel="noreferrer">`);
        Arrow_up_right($$renderer3, { class: "mr-1.5 shrink-0 text-xs " });
        $$renderer3.push(`<!----> Model website</a>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (publicConfig.isHuggingChat) {
        $$renderer3.push("<!--[0-->");
        if (!model()?.isRouter) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<a${attr("href", "https://huggingface.co/" + model().name + "?inference_api=true")} target="_blank" rel="noreferrer" class="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">`);
          Code($$renderer3, { class: "mr-1.5 shrink-0 text-xs" });
          $$renderer3.push(`<!----> Use via API</a> <a${attr("href", "https://huggingface.co/" + model().name)} target="_blank" rel="noreferrer" class="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">`);
          Arrow_up_right($$renderer3, { class: "mr-1.5 shrink-0 text-xs" });
          $$renderer3.push(`<!----> View model card</a>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> `);
        CopyToClipBoardBtn($$renderer3, {
          value: `${stringify(publicConfig.PUBLIC_ORIGIN || page.url.origin)}${stringify(base)}/models/${stringify(model().id)}`,
          classNames: "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-1 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60",
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="flex items-center gap-1.5">`);
            Copy($$renderer4, { class: "shrink-0 text-xs" });
            $$renderer4.push(`<!---->Copy direct link</div>`);
          }
        });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> <div class="relative flex w-full flex-col gap-2">`);
      if (model()?.isRouter) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<p class="mb-3 mt-2 rounded-lg bg-gray-100 px-3 py-2 text-sm dark:bg-white/5">`);
        IconOmni($$renderer3, { classNames: "-translate-y-px" });
        $$renderer3.push(`<!----> Omni routes your messages to the best underlying model
				depending on your request.</p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="flex w-full flex-row items-center justify-between"><h3 class="text-[15px] font-semibold text-gray-800 dark:text-gray-200">System Prompt</h3> <div class="flex items-center gap-2"><div class="flex select-none items-center gap-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-400"><span>Enabled</span> `);
      Switch($$renderer3, {
        name: "customPromptEnabled",
        size: "sm",
        get checked() {
          return bind_get();
        },
        set checked($$value) {
          bind_set($$value);
        }
      });
      $$renderer3.push(`<!----></div> `);
      if (hasCustomPreprompt()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button type="button" aria-label="Reset system prompt" title="Reset to default" class="grid size-6 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200">`);
        Reset($$renderer3, { class: "size-3.5" });
        $$renderer3.push(`<!----></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div> <textarea aria-label="Custom system prompt" rows="8"${attr("disabled", !getCustomPromptEnabled(), true)}${attr_class("scrollbar-custom w-full resize-none rounded-md border border-gray-200 bg-gray-50 p-2 text-[13px] transition-opacity dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200", void 0, { "opacity-30": !getCustomPromptEnabled() })}>`);
      const $$body = escape_html(getCustomPrompt());
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea> <div class="mt-3 rounded-xl border border-gray-200 bg-white px-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"><div class="divide-y divide-gray-200 dark:divide-gray-700"><div class="flex items-start justify-between py-3"><div><div class="text-[13px] font-medium text-gray-800 dark:text-gray-200">Tool calling (functions)</div> <p class="text-[12px] text-gray-500 dark:text-gray-400">Enable tools and allow the model to call them in chat.</p></div> `);
      Switch($$renderer3, {
        name: "forceTools",
        get checked() {
          return bind_get_1();
        },
        set checked($$value) {
          bind_set_1($$value);
        }
      });
      $$renderer3.push(`<!----></div> <div class="flex items-start justify-between py-3"><div><div class="text-[13px] font-medium text-gray-800 dark:text-gray-200">Multimodal support (image inputs)</div> <p class="text-[12px] text-gray-500 dark:text-gray-400">Enable image uploads and send images to this model.</p></div> `);
      Switch($$renderer3, {
        name: "forceMultimodal",
        get checked() {
          return bind_get_2();
        },
        set checked($$value) {
          bind_set_2($$value);
        }
      });
      $$renderer3.push(`<!----></div> `);
      if (model()?.isRouter) {
        $$renderer3.push("<!--[0-->");
        var bind_get_3 = getHidePromptExamples;
        var bind_set_3 = setHidePromptExamples;
        $$renderer3.push(`<div class="flex items-start justify-between py-3"><div><div class="text-[13px] font-medium text-gray-800 dark:text-gray-200">Hide prompt examples</div> <p class="text-[12px] text-gray-500 dark:text-gray-400">Hide the prompt suggestions above the chat input.</p></div> `);
        Switch($$renderer3, {
          name: "hidePromptExamples",
          get checked() {
            return bind_get_3();
          },
          set checked($$value) {
            bind_set_3($$value);
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div> `);
      if (publicConfig.isHuggingChat && model().providers?.length && !model()?.isRouter) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mt-3 flex flex-col items-start gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"><div><div class="text-[13px] font-medium text-gray-800 dark:text-gray-200">Inference Providers</div> <p class="text-[12px] text-gray-500 dark:text-gray-400">Choose which Inference Provider to use with this model. You can also manage provider
						preferences in <a class="underline decoration-gray-400 hover:decoration-gray-700 dark:decoration-gray-500 dark:hover:decoration-gray-300" target="_blank" href="https://huggingface.co/settings/inference-providers/settings">your HF settings</a>.</p></div> `);
        if (Select) {
          $$renderer3.push("<!--[-->");
          Select($$renderer3, {
            type: "single",
            value: getProviderOverride(),
            onValueChange: (v) => v && setProviderOverride(v),
            children: ($$renderer4) => {
              if (Select_trigger) {
                $$renderer4.push("<!--[-->");
                Select_trigger($$renderer4, {
                  "aria-label": "Select inference provider",
                  class: "inline-flex w-auto items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800",
                  children: ($$renderer5) => {
                    const currentValue = getProviderOverride();
                    const currentPolicy = PROVIDER_POLICIES.find((p) => p.value === currentValue);
                    const currentProvider = providerList().find((p) => p.provider === currentValue);
                    $$renderer5.push(`<span class="flex items-center gap-2">`);
                    if (currentValue === "auto") {
                      $$renderer5.push("<!--[0-->");
                      $$renderer5.push(`<span class="grid size-5 flex-none place-items-center rounded-md bg-gray-500/10">`);
                      Magic_wand_filled($$renderer5, { class: "size-3 text-gray-700 dark:text-gray-300" });
                      $$renderer5.push(`<!----></span>`);
                    } else if (currentValue === "fastest") {
                      $$renderer5.push("<!--[1-->");
                      $$renderer5.push(`<span class="grid size-5 flex-none place-items-center rounded-md bg-green-500/10 text-green-600 dark:text-green-500">`);
                      IconFast($$renderer5, { classNames: "size-3" });
                      $$renderer5.push(`<!----></span>`);
                    } else if (currentValue === "cheapest") {
                      $$renderer5.push("<!--[2-->");
                      $$renderer5.push(`<span class="grid size-5 flex-none place-items-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-500">`);
                      IconCheap($$renderer5, { classNames: "size-3" });
                      $$renderer5.push(`<!----></span>`);
                    } else if (currentProvider) {
                      $$renderer5.push("<!--[3-->");
                      const hubOrg = PROVIDERS_HUB_ORGS[currentValue];
                      if (hubOrg) {
                        $$renderer5.push("<!--[0-->");
                        $$renderer5.push(`<span class="flex size-5 flex-none items-center justify-center rounded-md bg-gray-500/10 p-0.5"><img${attr("src", `https://huggingface.co/api/avatars/${stringify(hubOrg)}`)} alt="" class="size-full rounded"/></span>`);
                      } else {
                        $$renderer5.push("<!--[-1-->");
                      }
                      $$renderer5.push(`<!--]-->`);
                    } else {
                      $$renderer5.push("<!--[-1-->");
                    }
                    $$renderer5.push(`<!--]--> ${escape_html(currentPolicy?.label ?? currentProvider?.provider ?? currentValue)}</span> `);
                    Chevron_down($$renderer5, { class: "size-4 text-gray-500" });
                    $$renderer5.push(`<!---->`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push("<!--]-->");
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push("<!--]-->");
              }
              $$renderer4.push(` `);
              if (Portal) {
                $$renderer4.push("<!--[-->");
                Portal($$renderer4, {
                  children: ($$renderer5) => {
                    if (Select_content) {
                      $$renderer5.push("<!--[-->");
                      Select_content($$renderer5, {
                        class: "scrollbar-custom z-50 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white/95 p-1 shadow-lg backdrop-blur dark:border-gray-700 dark:bg-gray-800/95",
                        sideOffset: 4,
                        children: ($$renderer6) => {
                          if (Select_group) {
                            $$renderer6.push("<!--[-->");
                            Select_group($$renderer6, {
                              children: ($$renderer7) => {
                                if (Select_group_heading) {
                                  $$renderer7.push("<!--[-->");
                                  Select_group_heading($$renderer7, {
                                    class: "px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400",
                                    children: ($$renderer8) => {
                                      $$renderer8.push(`<!---->Selection mode`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push("<!--]-->");
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                  $$renderer7.push("<!--]-->");
                                }
                                $$renderer7.push(` <!--[-->`);
                                const each_array = ensure_array_like(PROVIDER_POLICIES);
                                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                                  let opt = each_array[$$index];
                                  if (Select_item) {
                                    $$renderer7.push("<!--[-->");
                                    Select_item($$renderer7, {
                                      value: opt.value,
                                      class: "flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-100 dark:text-gray-200 dark:data-[highlighted]:bg-white/10",
                                      children: ($$renderer8) => {
                                        if (opt.value === "auto") {
                                          $$renderer8.push("<!--[0-->");
                                          $$renderer8.push(`<span class="grid size-5 flex-none place-items-center rounded-md bg-gray-500/10">`);
                                          Magic_wand_filled($$renderer8, { class: "size-3 text-gray-700 dark:text-gray-300" });
                                          $$renderer8.push(`<!----></span>`);
                                        } else if (opt.value === "fastest") {
                                          $$renderer8.push("<!--[1-->");
                                          $$renderer8.push(`<span class="grid size-5 flex-none place-items-center rounded-md bg-green-500/10 text-green-600 dark:text-green-500">`);
                                          IconFast($$renderer8, { classNames: "size-3" });
                                          $$renderer8.push(`<!----></span>`);
                                        } else if (opt.value === "cheapest") {
                                          $$renderer8.push("<!--[2-->");
                                          $$renderer8.push(`<span class="grid size-5 flex-none place-items-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-500">`);
                                          IconCheap($$renderer8, { classNames: "size-3" });
                                          $$renderer8.push(`<!----></span>`);
                                        } else {
                                          $$renderer8.push("<!--[-1-->");
                                        }
                                        $$renderer8.push(`<!--]--> <span class="flex-1">${escape_html(opt.label)}</span> `);
                                        if (getProviderOverride() === opt.value) {
                                          $$renderer8.push("<!--[0-->");
                                          Check($$renderer8, { class: "size-4 text-gray-500" });
                                        } else {
                                          $$renderer8.push("<!--[-1-->");
                                        }
                                        $$renderer8.push(`<!--]-->`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push("<!--]-->");
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                    $$renderer7.push("<!--]-->");
                                  }
                                }
                                $$renderer7.push(`<!--]-->`);
                              },
                              $$slots: { default: true }
                            });
                            $$renderer6.push("<!--]-->");
                          } else {
                            $$renderer6.push("<!--[!-->");
                            $$renderer6.push("<!--]-->");
                          }
                          $$renderer6.push(` <div class="my-1 h-px bg-gray-200 dark:bg-gray-700"></div> `);
                          if (Select_group) {
                            $$renderer6.push("<!--[-->");
                            Select_group($$renderer6, {
                              children: ($$renderer7) => {
                                if (Select_group_heading) {
                                  $$renderer7.push("<!--[-->");
                                  Select_group_heading($$renderer7, {
                                    class: "px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400",
                                    children: ($$renderer8) => {
                                      $$renderer8.push(`<!---->Specific provider`);
                                    },
                                    $$slots: { default: true }
                                  });
                                  $$renderer7.push("<!--]-->");
                                } else {
                                  $$renderer7.push("<!--[!-->");
                                  $$renderer7.push("<!--]-->");
                                }
                                $$renderer7.push(` <!--[-->`);
                                const each_array_1 = ensure_array_like(providerList());
                                for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                                  let prov = each_array_1[$$index_1];
                                  const hubOrg = PROVIDERS_HUB_ORGS[prov.provider];
                                  if (Select_item) {
                                    $$renderer7.push("<!--[-->");
                                    Select_item($$renderer7, {
                                      value: prov.provider,
                                      class: "flex cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-100 dark:text-gray-200 dark:data-[highlighted]:bg-white/10",
                                      children: ($$renderer8) => {
                                        if (hubOrg) {
                                          $$renderer8.push("<!--[0-->");
                                          $$renderer8.push(`<span class="flex size-5 flex-none items-center justify-center rounded-md bg-gray-500/10 p-0.5"><img${attr("src", `https://huggingface.co/api/avatars/${stringify(hubOrg)}`)} alt="" class="size-full rounded"/></span>`);
                                        } else {
                                          $$renderer8.push("<!--[-1-->");
                                          $$renderer8.push(`<span class="size-5"></span>`);
                                        }
                                        $$renderer8.push(`<!--]--> <span class="flex-1">${escape_html(prov.provider)}</span> `);
                                        if (getProviderOverride() === prov.provider) {
                                          $$renderer8.push("<!--[0-->");
                                          Check($$renderer8, { class: "size-4 text-gray-500" });
                                        } else {
                                          $$renderer8.push("<!--[-1-->");
                                        }
                                        $$renderer8.push(`<!--]-->`);
                                      },
                                      $$slots: { default: true }
                                    });
                                    $$renderer7.push("<!--]-->");
                                  } else {
                                    $$renderer7.push("<!--[!-->");
                                    $$renderer7.push("<!--]-->");
                                  }
                                }
                                $$renderer7.push(`<!--]-->`);
                              },
                              $$slots: { default: true }
                            });
                            $$renderer6.push("<!--]-->");
                          } else {
                            $$renderer6.push("<!--[!-->");
                            $$renderer6.push("<!--]-->");
                          }
                        },
                        $$slots: { default: true }
                      });
                      $$renderer5.push("<!--]-->");
                    } else {
                      $$renderer5.push("<!--[!-->");
                      $$renderer5.push("<!--]-->");
                    }
                  }
                });
                $$renderer4.push("<!--]-->");
              } else {
                $$renderer4.push("<!--[!-->");
                $$renderer4.push("<!--]-->");
              }
            },
            $$slots: { default: true }
          });
          $$renderer3.push("<!--]-->");
        } else {
          $$renderer3.push("<!--[!-->");
          $$renderer3.push("<!--]-->");
        }
        $$renderer3.push(`</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
