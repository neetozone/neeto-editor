# NeetoEditor

The **neetoEditor** library drives the rich text experience in the
[neeto products](https://neeto.com) built at
[BigBinary](https://www.bigbinary.com).

## Installation

```
yarn add @bigbinary/neeto-editor
```

For setting up image upload refer
https://neeto-editor.neeto.com/?path=/docs/examples-customize-options-addons--addons.

## Instructions for development

Install all the dependencies by executing following command.

```
yarn
```

Running the `yarn storybook` command starts a storybook application. Use this
application to test out changes.

When developing frontend packages, it's crucial to test changes in a live environment using a host application.
There are two ways to do this:

1. Using yalc package manager: https://youtu.be/F4zZFnrNTq8

> Note: If you are using yalc, you need to run `yarn bundle` after making changes to the package instead of `yarn build` which is described in the video.

2. Directly updating the node_modules of the host application.

    1. Start the host application server
    2. Inside the package, execute the command:

        ```
          yarn bundle --watch --app ../neeto-site-web
        ```

        Here replace ../neeto-site-web with path to the host project.

        Now, any changes made to the neetoEditor codebase will be instantly reflected in the UI.

    3. Remove local installation

        Run the following command to reset to the initial state.
        ```
        yarn install --check-files
        ```

    4. Translation File Changes (optional)

        Modifications in the neeto-editor translation files will not automatically update the UI. To verify these changes, update your neeto-site-web/app/javascript/packs/application.js file with the following code:

        ```
        import en from "translations/en.json";

        import editorEn from "neetofilters/app/javascript/src/translations/en.json";

        import { mergeDeepLeft } from "ramda";

        initializeApplication({
          translationResources: { en: { translation: mergeDeepLeft(editorEn, en) } },
        });
        ```

## Instructions for Publishing

### Package Release Process

A package is released upon merging a PR labeled as patch, minor, or major into the main branch. The patch label addresses bug fixes, minor signifies the addition of new features, and major denotes breaking changes, adhering to the principles outlined in [Semantic Versioning (SemVer)](https://semver.org/).

You can checkout the Create and publish releases workflow in GitHub Actions to get a live update.

### Manual Package Publishing

If you missed adding the label, you can manually publish the package. For that first, you need to create a PR to update the version number in the package.json file and merge it into the main branch. After merging the PR, you need to create a [new GitHub release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) from the main branch. Whenever a new release is created with a new version number, the GitHub actions will automatically publish the built package to npm. You can check out the Publish to npm workflow in GitHub Actions to get a live update.

> Note: before publishing the package, you must verify the functionality in host application [locally](#instructions-for-development).

## Documentation

Read the docs here: https://neeto-editor.neeto.com.
