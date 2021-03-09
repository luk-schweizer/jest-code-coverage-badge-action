# Jest Code Coverage Badge
[![build](https://github.com/luk-schweizer/jest-code-coverage-badge-action/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/luk-schweizer/jest-code-coverage-badge-action/actions/workflows/node.js.yml)
[![integration test](https://github.com/luk-schweizer/jest-code-coverage-badge-action/actions/workflows/integration-test.yml/badge.svg?branch=main)](https://github.com/luk-schweizer/jest-code-coverage-badge-action/actions/workflows/integration-test.yml)
[![coverage](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/c6bd776f/coverage)](https://github.com/luk-schweizer/jest-code-coverage-badge-action/actions/workflows/node.js.yml)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/luk-schweizer/jest-code-coverage-badge-action)

This is a [Github Action](https://github.com/features/actions) that will collect [Jest](https://jestjs.io) code coverage and create an informative badge using [Shields](https://shields.io).

## Features
- A free highly customizable badge, automatically updated and fetched by url.
- Badge can either show statements, conditionals or methods coverage percentage.
- Color of badge can be configured depending on the code coverage percentage.
- Badge get from [Shields Endpoint](https://shields.io/endpoint), so it is very easy to override styles and badge information via url parameters.
- Customizable test command.
- Code coverage parsed from [Clover XML report](https://istanbul.js.org/docs/advanced/alternative-reporters/#clover) default Jest coverage report.
- Badge information stored in [Key/Value as a Service (KVaaS)](https://keyvalue.xyz) free cloud service. No registration required.

<br/>

**Note:** Badge information will be public available. Anyone who knows the url can edit it. Here is an example of the information being stored:``{"schemaVersion":1,"label":"coverage","message":"75.4.1%","color":"green","namedLogo":"jest"}``

<br/>
<br/>

### Inputs

#### `test-command`

Command that will execute and collect test coverage data. **Should include --coverage option**. Default `"npx jest --coverage"`.

#### `coverage-type`

Coverage type to be gathered. Valid options are: statements, methods or conditionals. Default `"statements"`.

#### `badge-label`

Label for the badge. Default `"coverage"`.

#### `badge-logo`

Show Jest logo. Default `"true"`.

#### `badge-color-configuration`

Configuration for the badge colors depending on the code coverage percentage. Default `"[{"color": "red", ">=": 0, "<": 30 }, {"color": "orange", ">=": 30, "<": 40 },{"color": "yellow", ">=": 40, "<": 60 },{"color": "yellowgreen", ">=": 60, "<": 70 },{"color": "green", ">=": 70, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]"`.

#### `kvaas-key-url`

KVaaS key url where to post coverage values. If not present the action will generate a new url. More info in [https://keyvalue.xyz](https://keyvalue.xyz).

<br/>

### Outputs

#### `BADGE_URL`

The URL of the generated badge.


<br/>

## How to use

1) Generate a new key KVaaS url to store your badge information.
    - Run in shell:
    ```shell script
    curl -X POST https://api.keyvalue.xyz/new/coverage
    ```
    - Output example:
    ```shell script
    https://api.keyvalue.xyz/55b0216d/coverage
    ```
2) Add the following into your github workflow, using the output from **1)**.
    ```yaml
    uses: luk-schweizer/jest-code-coverage-badge-action@v1.0.0
    with:
     kvaas-key-url: 'https://api.keyvalue.xyz/55b0216d/coverage'
    ```
3) Add the badge in your readme file, using the output from **1)**.
    ```markdown
    ![](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/55b0216d/coverage)
    ```
4) That's it! 
   Badge will be automatically updated every time the workflow runs. 
**Note:** It can take some minutes until the badge updates in github. This happens because github uploads and manage images through camo proxy and it can take some time to update the source.

<br/>
<br/>

## Advanced use cases
#### 1. Customize your badge with shields
With shields endpoint you can override your badge with url parameters. For example, we can change the color, the label, the logo and the style: <br/>
![Custom badge](https://img.shields.io/endpoint?color=red&label=NewLabel&logo=github&logoColor=red&style=flat-square&url=https://api.keyvalue.xyz/b78465cf/coverage)
```markdown
![Custom badge](https://img.shields.io/endpoint?color=red&label=NewLabel&logo=github&logoColor=red&style=flat-square&url=https://api.keyvalue.xyz/b78465cf/coverage)
```
More information in [https://img.shields.io/endpoint/](https://img.shields.io/endpoint/)

#### 2. Multiple badges
Multiple badges can be generated with different coverage percentage.You will need to follow the [How to use](#how-to-use) section for each badge. For example: <br/>
![](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/b78465cf/coverage&style=plastic)
![](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/3d07498c/coverage&style=plastic)
![](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/0488b6f2/coverage&style=plastic)

- Workflow:
    ```yaml
  - name: Statements Badge Coverage
    uses: luk-schweizer/jest-code-coverage-badge-action@v1.0.0
    with:
      coverage-type: statements
      badge-label: statements 
      kvaas-key-url: 'https://api.keyvalue.xyz/b78465cf/coverage'
  - name: Conditionals Badge Coverage
    uses: luk-schweizer/jest-code-coverage-badge-action@v1.0.0
    with:
      coverage-type: conditionals
      badge-label: conditionals
      kvaas-key-url: 'https://api.keyvalue.xyz/3d07498c/coverage'
  - name: Methods Badge Coverage
    uses: luk-schweizer/jest-code-coverage-badge-action@v1.0.0
    with:
      coverage-type: methods
      badge-label: methods
      kvaas-key-url: 'https://api.keyvalue.xyz/0488b6f2/coverage'      
    ```
- Readme:
```markdown
![](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/b78465cf/coverage&style=plastic)
![](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/3d07498c/coverage&style=plastic)
![](https://img.shields.io/endpoint?url=https://api.keyvalue.xyz/0488b6f2/coverage&style=plastic)
```
