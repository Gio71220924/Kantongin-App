// Metro handles CSS imports; declare them so tsc doesn't choke on the
// template's global.css / *.module.css side-effect imports.
declare module '*.css';
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
