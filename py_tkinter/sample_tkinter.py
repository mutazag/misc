#!python
import tkinter as tk


class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.pack()
        self.create_widgets()

    def create_widgets(self):
        self.textbox = tk.Text(self)
        self.textbox.pack(side="top")
        self.textbox.insert(tk.END, "This is a textbox")
        self.hi_there = tk.Button(self)
        self.hi_there["text"] = "Hello World\n(click me)"
        self.hi_there["command"] = self.say_hi
        self.hi_there.pack(side="top")

        self.quit = tk.Button(self, text="QUIT", fg="red",
                              command=self.master.destroy)
        self.quit.pack(side="bottom")

    def say_hi(self):
        print("hi there, everyone!")
        strtext = self.textbox.get(1.0, tk.END)
        print(strtext)

root = tk.Tk()
app = Application(master=root)
app.mainloop()