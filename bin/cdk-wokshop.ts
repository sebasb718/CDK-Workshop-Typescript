#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkWokshopStack } from '../lib/cdk-wokshop-stack';

const app = new cdk.App();
new CdkWokshopStack(app, 'CdkWokshopStack');
