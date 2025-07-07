// === Theme Functions ====================

function openThemeDialog() {
	const dialog = document.getElementById("ThemeDialog")
	dialog.showModal()
}

function closeThemeDialog() {
	document.getElementById("ThemeDialog").close()
}

function ChangeTheme() {
	const checked = document.querySelector(".theme-checkbox:checked")
	if (checked) {		
		document.body.className = ""                                              //clear all existing theme classes
		document.body.classList.add(checked.id + "-theme")                        //set theme
		saveTheme(checked.id + "-theme")                                          //gives saveTheme() cb id + '-theme'      eg. crimson -> crimson-theme
	}
}

function saveTheme(themeName) {                            //themeName as a parameter
	localStorage.setItem("Theme", themeName)                 //saves theme name
}

function loadTheme() {
	const theme = localStorage.getItem("Theme")
	if (theme) {                                              //if theme has a value
		document.body.classList.add(theme)                      //change to theme
		const id = theme.replace("-theme", "")                  //gets rid of the -theme to get the cb id   eg. crimson-theme -> crimson
		const checkbox = document.getElementById(id)            //fetches the cb
		if (checkbox) checkbox.checked = true                   // if cb has a value, then checks the relevant checkbox
	}
  else{
    document.body.classList.add("midnight-theme")
  }
}

// === Theme Checkbox Logic ====================
document.addEventListener("DOMContentLoaded", () => {
	loadTheme()

	document.querySelectorAll('.theme-checkbox').forEach((checkbox) => {           //for each cb
		checkbox.addEventListener('change', function () {                            //check if it changed
			if (this.checked) {                                                        //if its checked				
				document.querySelectorAll('.theme-checkbox').forEach((cb) => {           //for each cb
					if (cb !== this) cb.checked = false                                    //check if its = to checked cb, yes = uncheck ; no = leave
				})
				ChangeTheme()                                                            //call func to change theme
			}
		})
	})
})

// === Notes App ===========================

let notes = []
let editingID = null

function openNoteDialog(noteID = null) {
	const dialog = document.getElementById("noteDialog")
	const title = document.getElementById("noteTitle")
	const content = document.getElementById("noteContent")

	if (noteID) {
		const editNote = notes.find(note => note.id === noteID)
		editingID = noteID
		document.getElementById("dialogTitle").textContent = "Edit Note"
		title.value = editNote.title
		content.value = editNote.content
	} else {
		editingID = null
		document.getElementById("dialogTitle").textContent = "Add New Note"
		title.value = ""
		content.value = ""
	}

	dialog.showModal()
	title.focus()
}

function closeNoteDialog() {
	document.getElementById("noteDialog").close()
}

function saveNote(event) {
	event.preventDefault()

	const title = document.getElementById("noteTitle").value.trim()
	const content = document.getElementById("noteContent").value.trim()

	if (editingID) {
		const noteIndex = notes.findIndex(note => note.id === editingID)
		notes[noteIndex] = {
			...notes[noteIndex],
			title,
			content
		}
	} else {
		notes.unshift({
			id: generateID(),
			title,
			content
		})
	}

	saveNotes()
	renderNotes()
	closeNoteDialog()
}

function deleteNotes(noteID) {
	notes = notes.filter(note => note.id !== noteID)
	saveNotes()
	renderNotes()
}

function generateID() {
	return Date.now().toString()
}

function saveNotes() {
	localStorage.setItem("Notes App", JSON.stringify(notes))
}

function loadNotes() {
	const saved = localStorage.getItem("Notes App")
	return saved ? JSON.parse(saved) : []
}

function renderNotes() {
	const notesContainer = document.getElementById("notesContainer")
	const emptyState = document.getElementById("emptyState")

	if (notes.length === 0) {
		emptyState.style.display = "flex"
		notesContainer.style.display = "none"
	} else {
		emptyState.style.display = "none"
		notesContainer.style.display = "grid"
		notesContainer.innerHTML = notes.map(note => `
			<div class="note-card">
				<h3 class="note-title">${note.title}</h3>
				<p class="note-content">${note.content}</p>
				<div class="note-actions">
					<button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
						</svg>
					</button>
					<button class="delete-btn" onclick="deleteNotes('${note.id}')" title="Delete Note">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
						</svg>
					</button>
				</div>
			</div>
		`).join("")
	}
}

// === Notes Initialization ====================
document.addEventListener("DOMContentLoaded", () => {
	notes = loadNotes()
	renderNotes()
	document.getElementById("noteDialog").addEventListener("submit", saveNote)
})
