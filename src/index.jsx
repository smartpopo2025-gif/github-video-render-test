import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GitHubRunnerTest} from './GitHubRunnerTest';

const Root = () => (
  <Composition
    id="GitHubRunnerTest"
    component={GitHubRunnerTest}
    durationInFrames={600}
    fps={30}
    width={1280}
    height={720}
  />
);

registerRoot(Root);
