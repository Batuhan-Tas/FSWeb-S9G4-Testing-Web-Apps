import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByText("İletişim Formu");
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Berk");
  expect(
    screen.getByText("Hata: ad en az 5 karakter olmalıdır.")
  ).toBeInTheDocument();
});
test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);

  userEvent.click(screen.getByText(/gönder/i));

  userEvent.type(screen.getByPlaceholderText("İlhan"), "");
  expect(
    screen.getByText("Hata: ad en az 5 karakter olmalıdır.")
  ).toBeInTheDocument();

  userEvent.type(screen.getByPlaceholderText("Mansız"), "");
  expect(screen.getByText("Hata: soyad gereklidir.")).toBeInTheDocument();

  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    ""
  );
  expect(
    screen.getByText("Hata: email geçerli bir email adresi olmalıdır.")
  ).toBeInTheDocument();

  expect(screen.queryAllByTestId("error").length).toBe(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);

  userEvent.type(screen.getByPlaceholderText("İlhan"), "Batuhan");

  userEvent.type(screen.getByPlaceholderText("Mansız"), "Taş");

  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "yanlısemail"
  );
  expect(
    screen.getByText("Hata: email geçerli bir email adresi olmalıdır.")
  ).toBeInTheDocument();

  expect(screen.queryAllByTestId("error").length).toBe(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "yanlisemail"
  );
  expect(
    screen.getByText("Hata: email geçerli bir email adresi olmalıdır.")
  ).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("Mansız"), "");
  userEvent.click(screen.getByText(/gönder/i));
  expect(screen.getByText("Hata: soyad gereklidir.")).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);

  userEvent.type(screen.getByPlaceholderText("İlhan"), "Batuhan");

  userEvent.type(screen.getByPlaceholderText("Mansız"), "Taş");

  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "trial@hotmail.com"
  );

  userEvent.type(screen.getByLabelText("Mesaj"), "");

  expect(screen.queryAllByTestId("error").length).toBe(0);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);

  userEvent.type(screen.getByPlaceholderText("İlhan"), "Batuhan");

  userEvent.type(screen.getByPlaceholderText("Mansız"), "Taş");

  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "trial@hotmail.com"
  );

  userEvent.type(screen.getByLabelText("Mesaj"), "Bu bir mesaj");

  userEvent.click(screen.getByText(/gönder/i));

  expect(screen.queryByTestId("firstnameDisplay")).toBeInTheDocument();
  expect(screen.queryByTestId("lastnameDisplay")).toBeInTheDocument();
  expect(screen.queryByTestId("emailDisplay")).toBeInTheDocument();
  expect(screen.queryByTestId("messageDisplay")).toBeInTheDocument();
});
