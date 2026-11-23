const newPatient = document.querySelector("#new-patient");
const count = document.querySelector("#patient-count");
const table = document.querySelector("#patient-table");
const rows = document.querySelector("#patient-rows");
const search = document.querySelector("#patient-search");
const emptyState = document.querySelector("#empty-state");
const notice = document.querySelector("#notice");
const editor = document.querySelector("#editor");
const patientForm = document.querySelector("#patient-form");
const details = document.querySelector("#details");
const removal = document.querySelector("#removal");
const removalForm = document.querySelector("#removal-form");

const genderLabels = new Map([
  ["female", "Feminino"],
  ["male", "Masculino"],
  ["non-binary", "Não binário"],
  ["undisclosed", "Prefiro não informar"],
]);
const genderValues = new Map(Array.from(genderLabels, ([value, label]) => [label, value]));

const careStatusLabels = new Map([
  ["admitted", "Internado"],
  ["observation", "Em observação"],
  ["discharged", "Alta hospitalar"],
]);
const hospitalFields = [
  "recordNumber", "birthDate", "unit", "bed", "admittedOn", "careStatus", "careTeam", "bloodType", "allergies",
];
const dateFormat = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

let patients = [];
let loaded = false;
let editedPatient;
let removedPatient;

async function api(path = "", method = "GET", data) {
  const response = await fetch(`/api/patients${path}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 204) return;
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Falha na comunicação com o servidor.");
  return result;
}

function showNotice(message, error = false) {
  notice.textContent = message;
  notice.toggleAttribute("data-error", error);
  notice.hidden = !message;
}

function normalized(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt-BR").trim();
}

function actionButton(label, patient, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-label", `${label} ${patient.name}`);
  button.addEventListener("click", () => action(patient));
  return button;
}

function renderPatients() {
  if (!loaded) return;
  count.textContent = patients.length.toLocaleString("pt-BR");
  const query = normalized(search.value);
  const visiblePatients = patients.filter(({ name, recordNumber }) =>
    normalized(name).includes(query) || (recordNumber && normalized(recordNumber).includes(query)),
  );
  const fragment = document.createDocumentFragment();

  for (const patient of visiblePatients) {
    const row = document.createElement("tr");
    row.insertCell().textContent = patient.name;
    row.insertCell().textContent = patient.recordNumber || "—";

    const location = row.insertCell();
    location.className = "summary-column";
    location.textContent = patient.unit || (patient.bed ? "" : "—");
    if (patient.bed) {
      const bed = document.createElement("span");
      bed.className = "bed";
      bed.textContent = `Leito ${patient.bed}`;
      location.append(bed);
    }

    const situation = row.insertCell();
    situation.className = "summary-column";
    if (careStatusLabels.has(patient.careStatus)) {
      const label = document.createElement("span");
      label.className = "status";
      label.dataset.status = patient.careStatus;
      label.textContent = careStatusLabels.get(patient.careStatus);
      situation.append(label);
    } else {
      situation.textContent = "—";
    }

    const actions = document.createElement("div");
    actions.className = "row-actions";
    actions.append(
      actionButton("Ver ficha", patient, openDetails),
      actionButton("Editar", patient, openEditor),
      actionButton("Excluir", patient, openRemoval),
    );
    row.insertCell().append(actions);
    fragment.append(row);
  }

  rows.replaceChildren(fragment);
  table.hidden = !visiblePatients.length;
  emptyState.hidden = Boolean(visiblePatients.length);
  emptyState.textContent = query ? "Nenhum paciente encontrado." : "Nenhum paciente cadastrado.";
}

async function refreshPatients() {
  try {
    patients = await api();
    loaded = true;
    renderPatients();
    return true;
  } catch {
    if (!loaded) emptyState.hidden = true;
    return false;
  }
}

function setFormError(form, message = "") {
  const error = form.querySelector(".form-error");
  error.textContent = message;
  error.hidden = !message;
}

function openEditor(patient) {
  editedPatient = patient;
  patientForm.reset();
  setFormError(patientForm);
  document.querySelector("#editor-title").textContent = patient ? "Editar paciente" : "Novo paciente";
  if (patient) {
    patientForm.elements.name.value = patient.name;
    patientForm.elements.age.value = patient.age;
    patientForm.elements.gender.value = genderLabels.get(patient.gender) ?? patient.gender;
    for (const field of hospitalFields) {
      patientForm.elements[field].value = patient[field] ?? "";
    }
  }
  editor.showModal();
}

function renderDetails(list, entries) {
  const groups = entries.map(([label, value, fullWidth]) => {
    const group = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    if (fullWidth) group.className = "full-width";
    term.textContent = label;
    description.textContent = value || "Não informado";
    group.append(term, description);
    return group;
  });
  list.replaceChildren(...groups);
}

function openDetails(patient) {
  document.querySelector("#details-name").textContent = patient.name;
  renderDetails(document.querySelector("#identity-details"), [
    ["Número do prontuário", patient.recordNumber],
    ["Data de nascimento", patient.birthDate && dateFormat.format(new Date(patient.birthDate))],
    ["Idade", `${patient.age} anos`],
    ["Gênero", genderLabels.get(patient.gender) ?? patient.gender],
  ]);
  renderDetails(document.querySelector("#hospital-details"), [
    ["Unidade hospitalar", patient.unit],
    ["Leito", patient.bed],
    ["Data de admissão", patient.admittedOn && dateFormat.format(new Date(patient.admittedOn))],
    ["Situação do atendimento", careStatusLabels.get(patient.careStatus)],
    ["Equipe responsável", patient.careTeam],
    ["Tipo sanguíneo", patient.bloodType],
    ["Alergias", patient.allergies, true],
  ]);
  details.showModal();
}

function openRemoval(patient) {
  removedPatient = patient;
  setFormError(removalForm);
  document.querySelector("#removal-name").textContent = patient.name;
  removal.showModal();
}

function onSubmit(form, action, message) {
  const dialog = form.closest("dialog");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const buttons = Array.from(form.querySelectorAll("button"));
    if (buttons.some((button) => button.disabled)) return;
    buttons.forEach((button) => { button.disabled = true; });
    setFormError(form);
    try {
      await action();
      const refreshed = await refreshPatients();
      dialog.close();
      showNotice(refreshed ? message : `${message} Não foi possível atualizar a lista. Recarregue a página.`, !refreshed);
      newPatient.focus();
    } catch (error) {
      setFormError(form, error.message || "Não foi possível concluir a operação.");
    } finally {
      buttons.forEach((button) => { button.disabled = false; });
    }
  });
  dialog.addEventListener("cancel", (event) => {
    if (form.querySelector("button:disabled")) event.preventDefault();
  });
  form.querySelector("[data-close]").addEventListener("click", () => dialog.close());
}

onSubmit(patientForm, () => {
  const gender = patientForm.elements.gender.value.trim();
  const data = {
    name: patientForm.elements.name.value.trim(),
    age: patientForm.elements.age.valueAsNumber,
    gender: genderValues.get(gender) ?? gender,
  };
  for (const field of hospitalFields) {
    const value = patientForm.elements[field].value.trim();
    if (value || editedPatient?.[field]) data[field] = value;
  }
  return editedPatient ? api(`/${editedPatient._id}`, "PUT", data) : api("", "POST", data);
}, "Cadastro salvo.");

onSubmit(removalForm, () => api(`/${removedPatient._id}`, "DELETE"), "Paciente excluído.");
newPatient.addEventListener("click", () => openEditor());
search.addEventListener("input", renderPatients);
void refreshPatients().then((refreshed) => {
  newPatient.disabled = false;
  if (!refreshed) showNotice("Não foi possível carregar os pacientes. Recarregue a página.", true);
});
