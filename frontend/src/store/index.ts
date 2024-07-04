import { createOvermind, IContext } from "overmind";
import { createActionsHook, createEffectsHook, createReactionHook, createStateHook } from "overmind-react";
import { merge, namespaced } from 'overmind/config';
import * as actions from './actions';
import * as app from './app';
import * as file from './files';
import { gql } from "./gql";
import { state } from "./state";

export const config = merge(
  {
    state,
    actions,
    effects: {
      gql
    }
  },
  namespaced({
    app,
    file
  })
)

export type Context = IContext<typeof config>

export const store = createOvermind(config)

export const useOState = createStateHook<Context>();
export const useOActions = createActionsHook<Context>();
export const useOEffects = createEffectsHook<Context>();
export const useOReaction = createReactionHook<Context>();
