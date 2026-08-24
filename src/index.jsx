import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {GitHubRunnerTest} from './GitHubRunnerTest';

const Root = () => (
  <Composition
    id="GitHubRunnerBenchmark"
    component={GitHubRunnerTest}
    durationInFrames={3600}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
