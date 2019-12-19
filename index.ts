// This code is part of Strilab, which is licensed under the MIT License.
// Copyright (c) 2019 Chiphyr <alexeek@protonmail.com>

import { readFileSync, readdirSync } from "fs";

interface Config {
  folder: string;
}

export function parseSync(file: string): object {
  const strings: object = {};

  if (
    !file.endsWith(".strl") &&
    !file.endsWith(".strl/") &&
    !file.endsWith(".strl\\")
  )
    throw new Error(
      "The file provided does not have the .strl file extension. This error was thrown for security."
    );

  let fileCont: string | string[] = readFileSync(`${file}`, "utf8");
  if (!fileCont) throw new Error(`${file} could not be read.`);

  fileCont = fileCont.split("\n");
  fileCont.forEach((line: string): object => {
    if (line.startsWith("#")) return;

    const [name, ...words]: string[] = line.split(" ");
    const joined: string = words.join(" ");

    return (strings[name] = { words, joined, name });
  });

  return strings;
}

export function parseFolderSync(folder: string): object {
  const strings: object = {};

  const dirCont: string[] = readdirSync(folder);
  if (!dirCont) throw new Error(`${folder} could not be read.`);

  dirCont.forEach((file: string): object => {
    const parsed: object = parseSync(`${folder}/${file}`);
    return (strings[file.replace(".strl", "")] = parsed);
  });

  return strings;
}

export class Reader {
  config: Config;
  strings: object;

  constructor(config: Config) {
    if (!config) throw new Error("A config object was not passed.");
    if (!config.folder)
      throw new Error("A folder property of the config object must exist.");

    this.config = config;
    this.strings = {};

    this.load();
  }

  load(): object {
    return (this.strings = parseFolderSync(this.config.folder));
  }

  get(locale: string, string: string): object {
    if (!locale || !string)
      throw new Error("Locale [1] and string [2] must both be passed.");
    return this.strings[locale][string] || null;
  }
}
