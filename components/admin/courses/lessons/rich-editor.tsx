"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    Heading1, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight,
    List, ListOrdered, Link2, ImageIcon,
    Undo, Redo, Code, Minus, FileCode
} from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Props {
    content: string
    onChange: (value: string) => void
}

export function RichEditor({ content, onChange }: Props) {
    const [linkOpen, setLinkOpen] = useState(false)
    const [imageOpen, setImageOpen] = useState(false)
    const [htmlOpen, setHtmlOpen] = useState(false)
    const [linkUrl, setLinkUrl] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [imageAlt, setImageAlt] = useState("")
    const [htmlInput, setHtmlInput] = useState("")

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({ inline: false, allowBase64: false }),
            Link.configure({ openOnClick: false, autolink: true }),
            Placeholder.configure({ placeholder: "Dars matnini shu yerga yozing..." }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4 focus:outline-none prose prose-sm dark:prose-invert max-w-none text-foreground"
            }
        }
    })

    if (!editor) return null

    const Btn = ({
        onClick, active, children, title
    }: {
        onClick: () => void
        active?: boolean
        children: React.ReactNode
        title: string
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded hover:bg-secondary transition-colors ${active
                ? "bg-secondary text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
        >
            {children}
        </button>
    )

    const handleAddLink = () => {
        if (!linkUrl) return
        editor.chain().focus().setLink({ href: linkUrl }).run()
        setLinkUrl("")
        setLinkOpen(false)
    }

    const handleAddImage = () => {
        if (!imageUrl) return
        editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt || "" }).run()
        setImageUrl("")
        setImageAlt("")
        setImageOpen(false)
    }

    const handleLoadHtml = () => {
        if (!htmlInput.trim()) return
        editor.commands.setContent(htmlInput)
        onChange(editor.getHTML())
        setHtmlInput("")
        setHtmlOpen(false)
    }

    const sep = <div className="w-px h-5 bg-border mx-0.5" />

    return (
        <>
            <div className="border border-border rounded-xl overflow-hidden bg-input">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-card">
                    <Btn onClick={() => editor.chain().focus().undo().run()} title="Orqaga"><Undo className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().redo().run()} title="Oldinga"><Redo className="w-4 h-4" /></Btn>
                    {sep}
                    <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Sarlavha 1"><Heading1 className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Sarlavha 2"><Heading2 className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Sarlavha 3"><Heading3 className="w-4 h-4" /></Btn>
                    {sep}
                    <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Qalin"><Bold className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Kursiv"><Italic className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Tagiga chiziq"><UnderlineIcon className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="O'chirilgan"><Strikethrough className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Kod"><Code className="w-4 h-4" /></Btn>
                    {sep}
                    <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Chapga"><AlignLeft className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Markazda"><AlignCenter className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="O'ngga"><AlignRight className="w-4 h-4" /></Btn>
                    {sep}
                    <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Ro'yxat"><List className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Raqamli ro'yxat"><ListOrdered className="w-4 h-4" /></Btn>
                    <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Chiziq"><Minus className="w-4 h-4" /></Btn>
                    {sep}
                    <Btn onClick={() => setLinkOpen(true)} active={editor.isActive("link")} title="Havola"><Link2 className="w-4 h-4" /></Btn>
                    <Btn onClick={() => setImageOpen(true)} title="Rasm"><ImageIcon className="w-4 h-4" /></Btn>
                    {sep}
                    <Btn onClick={() => { setHtmlInput(""); setHtmlOpen(true) }} title="HTML yuklash"><FileCode className="w-4 h-4" /></Btn>
                </div>

                {/* Editor */}
                <EditorContent editor={editor} />
            </div>

            {/* Link modal */}
            <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
                <DialogContent className="max-w-sm bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>Havola qo'shish</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div className="space-y-1.5">
                            <Label>URL</Label>
                            <Input
                                placeholder="https://..."
                                value={linkUrl}
                                onChange={e => setLinkUrl(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleAddLink()}
                                className="bg-input border-border text-foreground"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setLinkOpen(false)}>Bekor</Button>
                        <Button onClick={handleAddLink}>Qo'shish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Image modal */}
            <Dialog open={imageOpen} onOpenChange={setImageOpen}>
                <DialogContent className="max-w-sm bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>Rasm qo'shish</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <div className="space-y-1.5">
                            <Label>Rasm URL</Label>
                            <Input
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={e => setImageUrl(e.target.value)}
                                className="bg-input border-border text-foreground"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Alt matn (ixtiyoriy)</Label>
                            <Input
                                placeholder="Rasm tavsifi..."
                                value={imageAlt}
                                onChange={e => setImageAlt(e.target.value)}
                                className="bg-input border-border text-foreground"
                            />
                        </div>
                        {imageUrl && (
                            <img src={imageUrl} alt="preview" className="w-full rounded-lg object-cover max-h-40" />
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImageOpen(false)}>Bekor</Button>
                        <Button onClick={handleAddImage}>Qo'shish</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* HTML yuklash modal */}
            <Dialog open={htmlOpen} onOpenChange={setHtmlOpen}>
                <DialogContent className="max-w-2xl bg-card border-border text-foreground">
                    <DialogHeader>
                        <DialogTitle>HTML kodni yuklash</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <p className="text-xs text-muted-foreground">
                            HTML kodni quyida paste qiling. Mavjud kontent o'rniga yuklanadi.
                        </p>
                        <Textarea
                            placeholder="<h1>Sarlavha</h1><p>Matn...</p>"
                            value={htmlInput}
                            onChange={e => setHtmlInput(e.target.value)}
                            rows={12}
                            className="font-mono text-xs bg-input border-border text-foreground overflow-y-auto max-h-96"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setHtmlOpen(false)}>Bekor</Button>
                        <Button onClick={handleLoadHtml}>Yuklash</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}