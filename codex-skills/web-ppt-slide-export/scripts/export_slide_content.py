#!/usr/bin/env python3
"""Export each slide section from a Web PPT HTML file into Markdown."""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path


IGNORE_TAGS = {
    "script",
    "style",
    "svg",
    "path",
    "defs",
    "lineargradient",
    "stop",
}

VOID_IGNORE_TAGS = {
    "img",
    "meta",
    "link",
}

EMIT_TAGS = {
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "li",
    "td",
    "th",
    "figcaption",
    "button",
    "a",
}

LEAF_CONTAINER_TAGS = {
    "div",
    "span",
    "strong",
    "em",
    "small",
    "label",
    "article",
}

STRUCTURAL_CHILD_TAGS = {
    "section",
    "article",
    "div",
    "header",
    "footer",
    "aside",
    "ul",
    "ol",
    "table",
    "thead",
    "tbody",
    "tr",
    "figure",
    "dl",
}


@dataclass
class Node:
    tag: str
    attrs: dict[str, str]
    children: list["Node | str"] = field(default_factory=list)


def normalize_text(value: str) -> str:
    value = value.replace("\xa0", " ").replace("\n", " / ")
    value = re.sub(r"\s*/\s*", " / ", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip(" /")


def text_content(node: Node | str) -> str:
    if isinstance(node, str):
        return normalize_text(node)

    if node.tag == "br":
        return "\n"

    if node.tag in IGNORE_TAGS:
        return ""

    parts: list[str] = []
    for child in node.children:
        chunk = text_content(child)
        if chunk:
            parts.append(chunk)
    return normalize_text(" ".join(parts))


def should_emit_container(node: Node) -> bool:
    if node.tag not in LEAF_CONTAINER_TAGS:
        return False

    if not text_content(node):
        return False

    for child in node.children:
        if isinstance(child, str):
            continue
        if child.tag in IGNORE_TAGS or child.tag == "br":
            continue
        if child.tag in EMIT_TAGS or child.tag in STRUCTURAL_CHILD_TAGS:
            return False
    return True


def extract_lines(node: Node | str) -> list[str]:
    if isinstance(node, str):
        return []

    if node.tag in IGNORE_TAGS or node.tag == "br":
        return []

    if node.tag in EMIT_TAGS or should_emit_container(node):
        line = text_content(node)
        return [line] if line else []

    lines: list[str] = []
    for child in node.children:
        lines.extend(extract_lines(child))
    return lines


class SlideHTMLParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[Node] = []
        self.slides: list[Node] = []
        self.ignore_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attrs_dict = {key: value or "" for key, value in attrs}

        if self.ignore_depth or tag in IGNORE_TAGS:
            self.ignore_depth += 1
            return

        if tag in VOID_IGNORE_TAGS:
            return

        node = Node(tag=tag, attrs=attrs_dict)
        if self.stack:
            self.stack[-1].children.append(node)

        class_names = attrs_dict.get("class", "").split()
        is_slide = tag == "section" and "slide" in class_names
        if is_slide:
            self.stack.append(node)
            return

        if self.stack:
            self.stack.append(node)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if self.ignore_depth:
            self.ignore_depth -= 1
            return

        if not self.stack:
            return

        node = self.stack.pop()
        while node.tag != tag and self.stack:
            node = self.stack.pop()

        if node.tag == "section" and "slide" in node.attrs.get("class", "").split():
            self.slides.append(node)

    def handle_data(self, data: str) -> None:
        if self.ignore_depth or not self.stack:
            return
        if data.strip():
            self.stack[-1].children.append(data)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in VOID_IGNORE_TAGS or tag in IGNORE_TAGS:
            return
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)


def slide_title(node: Node) -> str:
    title = normalize_text(node.attrs.get("data-title", ""))
    if title:
        return title

    lines = extract_lines(node)
    return lines[0] if lines else "未命名页面"


def format_slide(page_no: int, node: Node) -> str:
    lines = extract_lines(node)
    ordered_lines: list[str] = []
    seen: set[str] = set()

    for line in lines:
        cleaned = normalize_text(line)
        if not cleaned:
            continue
        if cleaned in seen:
            continue
        seen.add(cleaned)
        ordered_lines.append(cleaned)

    title = slide_title(node)
    slide_id = node.attrs.get("id", "")
    parts = [f"## 第 {page_no} 页：{title}", ""]
    if slide_id:
        parts.append(f"- 原始页面 ID：`{slide_id}`")
    parts.extend(f"- {line}" for line in ordered_lines)
    parts.append("")
    return "\n".join(parts)


def export_slides(input_path: Path, output_path: Path) -> int:
    parser = SlideHTMLParser()
    parser.feed(input_path.read_text(encoding="utf-8"))

    slides = parser.slides
    content = [
        "# Web PPT 逐页内容导出",
        "",
        f"- 源文件：`{input_path.name}`",
        f"- 页面数：`{len(slides)}`",
        "",
        "> 本文件按页面顺序导出可见文本，适合继续整理为 PDF、Word 或讲稿。",
        "",
    ]

    content.extend(
        format_slide(index, slide).rstrip()
        for index, slide in enumerate(slides, start=1)
    )
    content.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(content), encoding="utf-8")
    return len(slides)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Export slide content from a static Web PPT HTML file into Markdown."
    )
    parser.add_argument("input", nargs="?", default="index.html", help="Input HTML file")
    parser.add_argument(
        "-o",
        "--output",
        default="exports/slide-content-export.md",
        help="Output Markdown file",
    )
    args = parser.parse_args()

    input_path = Path(args.input).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()
    slide_count = export_slides(input_path, output_path)
    print(f"Exported {slide_count} slides to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
